require('dotenv').config();
const express = require('express');
const multer = require('multer');
const imgur = require('imgur');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const {
  User, Date, UserInterest, Couple, Friends, Category, Spot, Op, Messages,
} = require('../database/models/index.js');
const {
  fetchRestaurants, fetchSpot, selectMatch, sanitizeUser, paramSplitter,
} = require('./helpers/index.js');
const { restDecider } = require('../database/helpers/db-helpers');

const app = express();
const upload = multer();
imgur.setClientId(process.env.ACCESS_TOKEN);
imgur.setAPIUrl('https://api.imgur.com/3/');

/*  Here is the authentication
 *  We're using passport which requires cookies and sessions
 */

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({
  extended: true,
}));
app.use(session({
  secret: 'third-wheel',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

/*  I don't entirely understand what (de)serializing a user does
 *  (ignore complexity, am I right?)
 */

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then(user => done(null, user))
    .catch(err => done(err));
});

/*  this is where we define the local strategy
 *  We're using simple username / password authentication
 */

passport.use(new LocalStrategy((username, password, done) => {
  User.findOne({
    username,
  })
    .then((user) => {
      if (!user) {
        return done(null, false, {
          message: 'Incorrect username',
        });
      }
      if (!user.validPassword(password)) {
        return done(null, false, {
          message: 'Incorrect password',
        });
      }
      return done(null, user);
    })
    .catch((err) => {
      console.error(`Could not authorize user: ${err}`);
      done(err);
    });
}));

/*  This is middleware to verify login
 *  It is used on any render except signup / login
 *  We will probably also use it on data requests after testing is done
 */

const loggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect('/#/login');
  }
};

/* DEFINE PATHS */

app.use(express.static(path.join(__dirname, '../client')));

/*  Define signup and login routes first
 *  they do not need verification middleware
 */
app.get('/#/signup', (req, res) => {
  res.redirect('/');
});

app.get('/#/login', (req, res) => {
  res.redirect('/');
});

//  All other get requests to pages should verify login first
app.get('/#/*', loggedIn, (req, res) => {
  res.redirect('/');
});

/* AUTHENTICATION REQUESTS */

app.post('/login', (req, res, next) => {
  passport.authenticate('local', async (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('/');
    }
    req.logIn(user, (logErr) => {
      if (logErr) {
        res.status(400).redirect('/');
      }
      req.session.userId = user.id;
      const sanitizedUser = sanitizeUser(user);
      return res.status(201).json(sanitizedUser);
    });
  })(req, res, next);
});

app.get('/logout', loggedIn, (req, res) => {
  req.session.destroy(() => {
    req.logout();
    res.redirect('/');
  });
});

/* DATA REQUESTS */

/*  This first checks if a user alread exists
 *  If this call only checks username, send true aka go-ahead
 *  If call is made with all fields, create the new user
 */
app.post('/signup', async (req, res) => {
  try {
    const { username } = req.body;

    //  First see if a user already exists with that username
    const user = await User.findOne({
      where: {
        username,
      },
    });
    if (user) {
      res.status(400).redirect('/');
    } else {
      //  Next get all the info we need and create a new user
      const options = req.body;
      const newUser = await User.create(options);

      //  This is a passport function that creates a session
      req.login(newUser, (err) => {
        if (err) {
          res.status(400).redirect('/');
        }
        req.session.userId = newUser.id;
        res.status(201).send();
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

//  This updates user information from the profile page
app.patch('/signup', async (req, res) => {
  const { userId: id } = req.session;
  const {
    age, gender, preference, bio, interests: interestIds,
  } = req.body;

  //  Note that interests are split off to be used in a join table
  const options = {
    age, gender, preference, bio,
  };
  try {
    const user = await User.findOne({
      where: {
        id,
      },
    });
    const updatedUser = await user.update(options, {
      where: {
        id,
      },
    });
    const sanitizedUser = sanitizeUser(updatedUser);
    if (interestIds) {
      interestIds.map(async interestId => UserInterest.findOrCreate({
        where: {
          userId: id,
          categoryId: interestId,
        },
      }));
    }
    res.status(201).json(sanitizedUser);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

/* Calls to query information */

//  this is to retrieve a specific user profile
app.get('/users', loggedIn, async (req, res) => {
  try {
    const { userId: id } = req.session;
    const user = await User.findByPk(id);
    const sanitizedUser = sanitizeUser(user);
    res.status(200).json(sanitizedUser);
  } catch (err) {
    console.error(`Failed to fetch user information: ${err}`);
    res.status(400).send();
  }
});

app.get('/customers', (req, res) => {
  User.findAll()
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      console.log(err);
    });
});

//  This is specifically built for editing location information
app.patch('/users', loggedIn, async (req, res) => {
  try {
    const { userId } = req.session;

    const options = req.body;
    const user = await User.findByPk(userId);
    const updatedUser = await user.update(options);
    const sanitizedUser = sanitizeUser(updatedUser);
    res.status(201).json(sanitizedUser);
  } catch (err) {
    console.error(`Failed to update user: ${err}`);
    res.status(500).json(err);
  }
});

//  This edits the user picture
app.patch('/users/pic/', upload.single('pic'), async (req, res) => {
  try {
    //  First get the buffered image from the req object
    const { buffer } = req.file;
    const pic = buffer.toString('base64');
    //  Upload the base64 encoded image and receive a data object
    const imgurData = await imgur.uploadBase64(pic);
    const {
      id: picId,
    } = imgurData.data;
    const { userId } = req.session;
    const user = await User.findByPk(userId);
    //  Update the user with the new url shortcode
    const updatedUser = await user.update({
      pic: picId,
    });
    const sanitizedUser = sanitizeUser(updatedUser);
    res.status(201).json(sanitizedUser);
  } catch (err) {
    console.error('Failed to patch user pic:', err);
    res.send(500).json(err);
  }
});

//  This retrieves the top-level categories ie Restaurants
app.get('/categories', (req, res) => Category.findAll({
  where: {
    parentId: null,
  },
})
  .then((categories) => {
    res.status(200).send(categories);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send(err);
  }));

//  This retrieves the subcategories aka interests
//    If we are looking in Restaurants, this retrieves
//    vietnamese, new american, hot dog, etc
app.get('/categories/:id', (req, res) => {
  const parentId = Number(req.params.id);
  return Category.findAll({
    where: {
      parentId,
    },
  })
    .then((interests) => {
      res.status(200).send(interests);
    })
    .catch((err) => {
      console.error(`Failed to retrieve interests: ${err}`);
      res.status(500).send(err);
    });
});

// Posts couple IDs to couples table on accept from the matches route
let currentUserID = 1;

app.post('/couples', (req, res) => {
  console.log('inside app post');
  console.log('couples req.body:', req.body);
  currentUserID = req.body.user1Id;
  Couple.create(req.body);
  res.status(201).send(req.body);
});

app.get('/couples', (req, res) => {
  Couple.findAll({
    where: {
      user1id: currentUserID,
    },
  })
    .then((couples) => {
      console.log('couples from server get:', couples);
      const matches = couples.map(match => match.user2Id);
      console.log('matches:', matches);
      const duplicateFreeMatches = [];
      matches.forEach((match) => {
        if (duplicateFreeMatches.indexOf(match) === -1) {
          duplicateFreeMatches.push(match);
        }
      });
      console.log('duplicate free matches:', duplicateFreeMatches);
      // res.send(couples);
      // return duplicateFreeMatches.forEach(matchID => User.findByPk(matchID));
      return User.findAll({
        where: {
          id: {
            [Op.or]: duplicateFreeMatches,
          },
        },
      });
    })
    .then((people) => {
      console.log('people from server', people);
      res.send(people);
    })
    .catch((err) => {
      console.log('couples get error:', err);
      res.send(500);
    });
});

app.delete('/couples', (req, res) => {
  console.log('inside server delete couples');
  console.log('req.body delete', req.body);
  const { userId, dumpId } = req.body;
  Couple.destroy({
    where: {
      user1Id: userId,
      user2Id: dumpId,
    },
  })
  .then((result) => {
    console.log('server delete result:', result);
    res.send(200);
  })
  .catch((err) => {
    console.log('error from server delete couple:', err);
  });

});

// Functionality for Friends routes to store, get, and delete friends of user

app.post('/friends', (req, res) => {
  console.log('inside app friends post');
  console.log('friends req.body:', req.body);
  currentUserID = req.body.user1Id;
  Friends.create(req.body);
  res.status(201).send(req.body);
});

app.get('/friends', (req, res) => {
  Friends.findAll({
    where: {
      user1id: currentUserID,
    },
  })
    .then((friends) => {
      console.log('friends from server get:', friends);
      const friendIds = friends.map(match => match.user2Id);
      console.log('friendIds:', friendIds);
      const duplicateFreeFriendIds = [];
      friendIds.forEach((friendId) => {
        if (duplicateFreeFriendIds.indexOf(friendId) === -1) {
          duplicateFreeFriendIds.push(friendId);
        }
      });
      console.log('duplicate free friends:', duplicateFreeFriendIds);
      // res.send(couples);
      // return duplicateFreeMatches.forEach(matchID => User.findByPk(matchID));
      return User.findAll({
        where: {
          id: {
            [Op.or]: duplicateFreeFriendIds,
          },
        },
      });
    })
    .then((people) => {
      console.log('people from server for friends', people);
      res.send(people);
    })
    .catch((err) => {
      console.log('friends get error:', err);
      res.send(500);
    });
});

app.delete('/friends', (req, res) => {
  console.log('inside server delete friends');
  console.log('req.body delete friends', req.body);
  const { userId, ghostId } = req.body;
  Friends.destroy({
    where: {
      user1Id: userId,
      user2Id: ghostId,
    },
  })
    .then((result) => {
      console.log('server friend delete result:', result);
      res.send(200);
    })
    .catch((err) => {
      console.log('error from server delete friends:', err);
    });

});


//  This finds a matching user and posts to Couple
//  It finds matching interests within a certain radius
//  We set the default status to null
//    If one person accepts, it becomes pending
//    If both accept we find a date!
app.post('/matches', async (req, res) => {
  try {
    //  First we get the user information
    const { userId } = req.session;
    const user = await User.findByPk(userId);
    const interests = await UserInterest.findAll({
      userId,
    });
    const interestsIds = interests.map(interest => interest.categoryId);
    //  Here we use a custom method to find suitable matches
    const matches = await user.findMatches(interestsIds, user);
    const matchId = selectMatch(matches);
    if (matchId) {
      const coupleValues = {
        user1Id: userId,
        user2Id: matchId,
        status: null,
      };
      //  We create the couple and send back the matched user information
      const couplePromise = Couple.create(coupleValues);
      const matchedUserPromise = User.findByPk(matchId);
      Promise.all([couplePromise, matchedUserPromise])
        .then(([couple, matchedUser]) => {
          const sanitizedMatch = sanitizeUser(matchedUser);
          sanitizedMatch.coupleId = couple.id;
          res.status(201).send(sanitizedMatch);
        });
    } else {
      res.status(400).send({});
    }
  } catch (err) {
    console.error(`Failed to find a match: ${err}`);
    res.status(500).send(err);
  }
});

//  This retrieves outgoing and incoming requests
app.get('/matches/:bound', async (req, res) => {
  try {
    const bound = paramSplitter(req.params.bound)[1];
    const { status } = req.body;
    const { userId } = req.session;
    if (bound === 'outbound') {
      //  Semantically, user1 requested the date
      //  a null status means that no one has acted on it
      const couples = await Couple.findAll({
        where: {
          user1Id: userId,
          status: {
            [Op.or]: [status, null],
          },
        },
      });
      const parsedCouples = couples.map(couple => ({
        coupleId: couple.id,
        partnerId: couple.user2Id,
      }));
      res.status(200).json(parsedCouples);
    }
    if (bound === 'inbound') {
      //  user2 was requested a date
      //  they cannot see requests they weren't offered
      //    ie no access to a null status
      const couples = await Couple.findAll({
        where: {
          user2Id: userId,
          status,
        },
      });
      const parsedCouples = couples.map(couple => ({
        coupleId: couple.id,
        partnerId: couple.user1Id,
      }));
      res.status(200).json(parsedCouples);
    }
  } catch (err) {
    console.error(`Failed to get matches: ${err}`);
    res.status(500).json(err);
  }
});


//  this updates a couple status
//  if accepted we need to create a new date!
app.patch('/matches', async (req, res) => {
  try {
    const { status, coupleId } = req.body;
    const couple = await Couple.findByPk(coupleId);
    const { status: oldStatus } = couple;
    //  if the status is rejected then the match is forever hidden
    if (status === 'rejected') {
      const updatedCouple = await couple.update({ status });
      res.status(201).json(updatedCouple);
      //  If the oldStatus was null, then only one person has now accepted
      //  This is what we may think of as requesting a date
    } else if (status === 'accepted' && oldStatus === null) {
      const updatedCouple = await couple.update({
        status: 'pending',
      });
      res.status(201).json(updatedCouple);
      //  If the oldStatus was pending, we have a date!
    } else if (status === 'accepted' && oldStatus === 'pending') {
      const updatedCouple = await couple.update({
        status,
      });
      //  This is a custom function to find a suitable date spot
      const spot = await updatedCouple.findSpot(updatedCouple);
      const { id: apiId } = spot;
      //  Only create a new spot in the database if it is new
      const { id: spotId } = await Spot.findOrCreate({ apiId });
      const { id: dateId } = await Date.create({
        coupleId,
        spotId,
      });
      res.status(201).json(dateId);
    }
  } catch (err) {
    console.error(`Failed to update couple: ${err}`);
    res.status(500).json(err);
  }
});

//  This function will find 5 potential date spots
//  This only uses api calls and does not need to store in the database
//  If the user clicks one of them, we will find them a date there!
app.get('/hotspots', async (req, res) => {
  try {
    const { userId } = req.session;
    const { latitude, longitude } = await User.findByPk(userId);
    const userInterests = await UserInterest.findAll({
      where: {
        userId,
      },
    });
    const categoryIds = userInterests.map(userInt => userInt.categoryId);
    const categories = await Category.findAll({
      where: {
        id: {
          [Op.or]: categoryIds,
        },
      },
    });
    const categoryAliases = categories.map(category => category.alias);
    //  This helper does the dirty work
    const hotspots = await fetchRestaurants(categoryAliases, latitude, longitude);
    res.status(200).json(hotspots);
  } catch (err) {
    console.error(`Failed to find hotspots: ${err}`);
    res.status(500).json(err);
  }
});

//  This inserts a new spot and finds a date to go there
app.post('/hotspots', async (req, res) => {
  try {
    //  Here we need to find matching categories between the spot and user
    const { apiId } = req.body;
    const { spotId } = await Spot.findOrCreate({ apiId });
    const { userId } = req.session;
    //  This gets the users interests
    const userInterests = await UserInterest.findAll({
      where: {
        userId,
      },
    });
    const categories = userInterests.map(userInt => userInt.categoryId);
    //  this gets the spot categories using the aliases and isolates ids
    const { categories: apiCategories } = await fetchSpot(apiId);
    const spotAliases = apiCategories.map(category => category.alias);
    const spotCategories = await Category.findAll({
      where: {
        alias: {
          [Op.or]: spotAliases,
        },
      },
    });
    const spotCategoryIds = spotCategories.map(spotCat => spotCat.categoryId);
    //  Here we isolate only the ones that both arrays contain
    const matchedCategories = categories.reduce((matches, categoryId) => {
      if (spotCategoryIds.includes(categoryId)) {
        matches.push(categoryId);
      }
      return matches;
    }, []);
    //  Now we use a custom method to find a partner
    const user = await User.findByPk(userId);
    const matches = await user.findMatches(matchedCategories, user);
    const matchId = selectMatch(matches);
    //  Set the couple AND the date, since the spot is prearranged
    const coupleOptions = {
      user1: userId,
      user2: matchId,
      status: 'pending',
    };
    const { coupleId } = await Couple.create(coupleOptions);
    const date = await Date.create({
      coupleId,
      spotId,
    });
    res.status(201).json(date);
  } catch (err) {
    console.error(`Failed to insert new spot: ${err}`);
    res.status(500).json(err);
  }
});

//  This will fetch all dates associated with a user
app.get('/dates', async (req, res) => {
  try {
    const { userId } = req.session;
    //  First find all couple ids with status 'accepted'
    const couples = await Couple.findAll({
      where: {
        status: 'accepted',
        [Op.or]: [{
          user1Id: userId,
        }, {
          user2Id: userId,
        }],
      },
    });

    //  Next we find all dates with those coupleIds
    const coupleIds = couples.map(couple => couple.coupleId);
    const dates = await Date.findAll({
      where: {
        coupleId: {
          [Op.or]: coupleIds,
        },
      },
    });

    //  Next we need to get info to return!
    //  We need the restaurant info and the partner
    const datesInfo = await dates.map(async (date) => {
      const dateInfo = {};
      const {
        id: dateId,
        spotId,
        coupleId,
      } = date;
      const { apiId } = await Spot.findOne({
        id: spotId,
      });
      dateInfo.dateId = dateId;
      dateInfo.spot = await fetchSpot(apiId);
      //  This is awful time complexity, should be improved
      couples.forEach(async (couple) => {
        const {
          id, user1Id, user2Id,
        } = couple;
        if (id === coupleId) {
          if (user1Id !== userId) {
            const partner = await User.findByPk(user1Id);
            dateInfo.parner = sanitizeUser(partner);
          } else {
            const partner = await User.findByPk(user2Id);
            dateInfo.parner = sanitizeUser(partner);
          }
        }
      });
      return dateInfo;
    });

    //  Now we can send it off
    res.status(200).json(datesInfo);
  } catch (err) {
    console.error(`Failed to get dates: ${err}`);
    res.status(500).json(err);
  }
});

//  This removes a date from the records
app.delete('/dates/:dateId', async (req, res) => {
  try {
    const dateId = Number(paramSplitter(req.params.dateId)[1]);
    const result = await Date.destroy({
      id: dateId,
    });
    res.status(201).json(result);
  } catch (err) {
    console.error(`Failed to delete date: ${dateId}`);
    res.status(500).json(err);
  }
});

// //////////////////////////////////////////////////////////////
// franco
app.get('/restDecider', async (req, res) => {
  try {
    const { userId } = req.session;
    const { latitude, longitude } = await User.findByPk(userId);
    const { restaurantFilter } = req.query;
    const alias = restaurantFilter;
    console.log(alias, typeof alias);
    const data = await restDecider(alias, latitude, longitude);
    console.log(data);
    res.json(data);
  } catch (err) {
    console.log(`shame on you ${err}`);
    res.json(err);
  }
});

app.patch('/updateUser', async (req, res) => {
  const {
 age, bio, gender, int1, int2, int3, preference 
} = req.query;
  const { userId } = req.session;
  const options = {
    age,
    bio,
    gender,
    int1,
    int2,
    int3,
    preference,
  };
  try {
    const user = await User.findOne({
      where: {
        id: userId,
      },
    });
    const updatedUser = await user.update(options, {
      where: {
        id: userId,
      },
    });
    console.log(updatedUser);
    res.send('User Updated');
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

app.post('/sendMessage', async (req, res) => {
  const { message, sentFrom, userId } = req.query;
  console.log(message, sentFrom, userId);
  try {
    const savedMessage = await Messages.create({
      sentFrom,
      userId,
      message,
    });
    res.send(savedMessage);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

app.get('/sendMessage', async (req, res) => {
  const { userId } = req.query;
  try {
    const storedMessages = await Messages.findAll({
      where: {
        userId: 1,
      },
    });
    res.send(storedMessages);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);
