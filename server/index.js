require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const {
  User, Date, UserInterest, Couple, Category, Spot,
} = require('../database/models/index.js');
const {
  selectMatch, sanitizeUser,
} = require('./helpers/index.js');

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({
  secret: 'third-wheel',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then(user => done(null, user))
    .catch(err => done(err));
});

passport.use(new LocalStrategy((username, password, done) => {
  User.findOne({ username })
    .then((user) => {
      if (!user) {
        return done(null, false, { message: 'Incorrect username' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password' });
      }
      return done(null, user);
    })
    .catch((err) => {
      console.error(`Could not authorize user: ${err}`);
      done(err);
    });
}));

const loggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect('/#/login');
  }
};

/* Define paths */

app.use(express.static(path.join(__dirname, '../client')));

//  Define signup and login routes first
//  they do not need verification middleware
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

/* Here are the authentication requests */

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
        res.status(400).json(logErr);
      }
      req.session.userId = user.id;
      res.status(201).json(user);
    });
  })(req, res, next);
});

app.get('/logout', loggedIn, (req, res) => {
  req.logout();
  res.redirect('/');
});

//  This first checks if a user alread exists
//  If this call only checks username, send true aka go-ahead
//  If call is made with all fields, create the new user
app.post('/signup', async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ where: { username } });
    if (user) {
      res.status(400).send(false);
    } else {
      const options = req.body;
      const newUser = await User.create(options);
      req.login(newUser, (err) => {
        if (err) {
          res.status(400).json(err);
        }
        req.session.userId = newUser.id;
        res.status(201).send(newUser);
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

/* Calls to query information */

app.get('/users', loggedIn, (req, res) => {
  //  this is to retrieve a specific user profile
  // const { id } = req.params;
  const id = req.session.userId;
  User.findByPk(id)
    .then((user) => {
      const {
        name, age, preference, gender, bio, url,
      } = user;
      const result = {
        id, name, age, preference, gender, bio, url,
      };
      res.status(200).send(result);
    })
    .catch((err) => {
      console.error(`Failed to fetch user information: ${err}`);
      res.status(400).send(err);
    });
});

app.patch('/users', async (req, res) => {
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

//  This retrieves the top-level categories ie Restaurants
app.get('/categories', (req, res) => Category.findAll({ where: { parentId: null } })
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
  const { id: parentId } = req.params;
  return Category.findAll({ where: { parentId } })
    .then((interests) => {
      res.status(200).send(interests);
    })
    .catch((err) => {
      console.error(`Failed to retrieve interests: ${err}`);
      res.status(500).send(err);
    });
});

app.get('/interests/:userId', loggedIn, (req, res) => {
  //  this is to find new spots around the user
});

app.get('/matches/:userId', loggedIn, (req, res) => {
  //  this is to retrieve all of the current matches
});

//  This finds a matching user and posts to Couple
//  It finds matching interests within a certain radius
app.post('/matches/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId);
    const interests = await UserInterest.findAll({ userId });
    const matches = await user.findInterests(interests, user);
    const matchId = selectMatch(matches);
    const coupleValues = {
      user1Id: userId,
      user2Id: matchId,
      status: 'pending',
    };
    const couple = await Couple.create(coupleValues);
    res.status(201).send(couple);
  } catch (err) {
    console.error(`Failed to find a match: ${err}`);
    res.status(500).send(err);
  }
});

app.get('/matches/:bound', (req, res) => {
  const { bound } = req.params;
  const { userId, status } = req.body;
  if (bound === 'outbound') {
    return Couple.findAll({ where: { user1Id: userId, status } })
      .then(result => res.status(200).send(result))
      .catch((err) => {
        console.error(`error: ${err}`);
        res.send(500).send(err);
      });
  }
  if (bound === 'inbound') {
    return Couple.findAll({ where: { user2Id: userId, status } })
      .then(result => res.status(200).send(result))
      .catch((err) => {
        console.error(`error: ${err}`);
        res.send(500).send(err);
      });
  }
});

//  this updates a couple status
//  probably only from pending to accepted or rejected
//  if accepted we need to create a new date!
app.patch('/matches', async (req, res) => {
  try {
    const { status, coupleId } = req.body;
    const couple = await Couple.findByPK(coupleId);
    const updatedCouple = await couple.update({ status });
    if (status === 'rejected') {
      res.status(201).json(updatedCouple);
    } else {
      const spot = await updatedCouple.findSpot(updatedCouple);
      const { id: apiId } = spot;
      const { id: spotId } = await Spot.create({ apiId });
      const { id: dateId } = await Date.create({ coupleId, spotId });
      res.status(201).json(dateId);
    }
  } catch (err) {
    console.error(`Failed to update couple: ${err}`);
    res.status(500).json(err);
  }
});

//  This updates user information
//  Note that interests are split off to be used in a join table
app.patch('/signup/:id', async (req, res) => {
  const { id } = req.params;
  const {
    name,
    pic,
    age,
    preference,
    bio,
    interests,
  } = req.body;
  const options = {
    name,
    pic,
    age,
    preference,
    bio,
  };
  try {
    const user = await User.findOne({ where: { id } });
    if (user) {
      const updatedUser = user.update(options, { where: { id } });
      const updatedInterests = interests.map((interest) => {
        return UserInterest.create({ userId: id, categoryId: interest.id });
      });
      Promise.all([updatedUser, updatedInterests])
        .then(() => res.status(201).json(updatedUser.id));
    } else {
      res.status(400).send();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);
