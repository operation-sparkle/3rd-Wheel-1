require('dotenv').config();
const express = require('express');
const multer = require('multer');
const imgur = require('imgur');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const {
  User,
  Date,
  UserInterest,
  Couple,
  Category,
  Spot,
} = require('../database/models/index.js');
const {
  fetchRestaurants,
  fetchSpot,
  selectMatch,
  sanitizeUser,
  paramSplitter,
} = require('./helpers/index.js');

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
  req.logout();
  res.redirect('/');
});

/* DATA REQUESTS */

/*  This first checks if a user alread exists
 *  If this call only checks username, send true aka go-ahead
 *  If call is made with all fields, create the new user
 */
app.post('/signup', async (req, res) => {
  try {
    const {
      username,
    } = req.body;

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
  const id = Number(paramSplitter(req.session.userId)[1]);
  const {
    age, preference, bio, interests,
  } = req.body;
  //  Note that interests are split off to be used in a join table
  const options = {
    age, preference, bio,
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
    if (interests) {
      interests.map(async (interest) => UserInterest.findOrCreate({
          where: {
            userId: id,
            categoryId: interest.id,
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
    const id = req.session.userId;
    const user = await User.findByPk(id);
    const sanitizedUser = sanitizeUser(user);
    res.status(200).json(sanitizedUser);
  } catch (err) {
    console.error(`Failed to fetch user information: ${err}`);
    res.status(400).send();
  }
});

//  This is specifically built for editing location information
app.patch('/users', async (req, res) => {
  try {
    const {
      userId,
    } = req.session;

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
    const {
      buffer,
    } = req.file;
    const pic = buffer.toString('base64');
    //  Upload the base64 encoded image and receive a data object
    const imgurData = await imgur.uploadBase64(pic);
    const {
      id: picId,
    } = imgurData.data;
    const userId = Number(paramSplitter(req.session.userId)[1]);
    const user = await User.findByPk(userId);
    //  Update the user with the new url shortcode
    const updatedUser = await user.update({
      pic: picId,
    });
    const sanitizedUser = sanitizeUser(updatedUser);
    res.status(201).json(sanitizedUser);
  } catch (err) {
    console.error(`Failed to patch user pic: ${err}`);
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
  const {
    id: parentId,
  } = req.params;
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

//  This finds a matching user and posts to Couple
//  It finds matching interests within a certain radius
//  We set the default status to null
//    If one person accepts, it becomes pending
//    If both accept we find a date!
app.post('/matches', async (req, res) => {
  try {
    //  First we get the user information
    const userId = Number(paramSplitter(req.session.userId)[1]);
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
    const {
      bound,
    } = req.params;
    const {
      status,
    } = req.body;
    const userId = Number(paramSplitter(req.session.userId)[1]);
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
        attributes: ['id', 'user2Id'],
      });
      res.status(200).json(couples);
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
        attributes: ['id', 'user1Id'],
      });
      res.status(200).json(couples);
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
    const {
      status,
      coupleId,
    } = req.body;
    const couple = await Couple.findByPk(coupleId);
    const {
      status: oldStatus,
    } = couple;
    //  if the status is rejected then the match is forever hidden
    if (status === 'rejected') {
      const updatedCouple = await couple.update({
        status,
      });
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
      const {
        id: apiId,
      } = spot;
      //  Only create a new spot in the database if it is new
      const {
        id: spotId,
      } = await Spot.findOrCreate({
        apiId,
      });
      const {
        id: dateId,
      } = await Date.create({
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
    const userId = Number(paramSplitter(req.session.userId)[1]);
    const {
      latitude,
      longitude,
    } = await User.findByPk(userId);
    const categories = await UserInterest.findAll({
      where: {
        userId,
      },
      attributes: ['alias'],
    });
    //  This helper does the dirty work
    const hotspots = await fetchRestaurants(categories, latitude, longitude);
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
    const {
      apiId,
    } = req.body;
    const {
      spotId,
    } = await Spot.findOrCreate({
      apiId,
    });
    const userId = Number(paramSplitter(req.session.userId)[1]);
    //  This gets the users interests
    const categories = await UserInterest.findAll({
      where: {
        userId,
      },
      attributes: ['categoryId'],
    });
    //  this gets the spot categories using the aliases and isolates ids
    const {
      categories: spotCategories,
    } = await fetchSpot(apiId);
    const spotAliases = spotCategories.map(category => category.alias);
    const spotCategoryIds = await Category.findAll({
      where: {
        alias: {
          [Op.or]: spotAliases,
        },
      },
      attributes: ['categoryId'],
    });
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
    const {
      coupleId,
    } = await Couple.create(coupleOptions);
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
    const userId = Number(paramSplitter(req.session.userId)[1]);
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
      const {
        apiId,
      } = await Spot.findOne({
        id: spotId,
      });
      dateInfo.dateId = dateId;
      dateInfo.spot = await fetchSpot(apiId);
      //  This is awful time complexity, should be improved
      couples.forEach(async (couple) => {
        const {
          id,
          user1Id,
          user2Id,
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
    const {
      dateId,
    } = req.params;
    const result = await Date.destroy({
      id: dateId,
    });
    res.status(201).json(result);
  } catch (err) {
    console.error(`Failed to delete date: ${dateId}`);
    res.status(500).json(err);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);
