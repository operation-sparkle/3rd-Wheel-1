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

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({ secret: 'third-wheel' }));
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

app.use(express.static(path.join(__dirname, '../client')));

//  Define signup and login routes first
//  they do not need verification middleware
app.get('/#/signup', (req, res) => {
  res.redirect('/');
});

const loggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect('/login');
  }
};

app.get('/users/:id', loggedIn, (req, res) => {
  //  this is to retrieve a specific user profile
  const { id } = req.params;
  User.findByPk(id)
    .then((user) => {
      const {
        name, age, preference, gender, bio, url,
      } = user;
      const result = {
        name, age, preference, gender, bio, url,
      };
      res.status(200).send(result);
    })
    .catch((err) => {
      console.error(`Failed to fetch user information: ${err}`);
      res.status(400).send(err);
    });
});

//  This retrieves the top-level categories ie Restaurants
app.get('/categories', (req, res) => {
  return Category.findAll({ where: { parentId: null } })
    .then((categories) => {
      res.status(200).send(categories);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(err);
    });
});

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
      console.error(`Failed to retrieve interests: ${err}`)
      res.status(500).send(err);
    })
});

app.get('/interests/:userId', loggedIn, (req, res) => {
  //  this is to find new spots around the user
});

app.get('/matches/:userId', loggedIn, (req, res) => {
  //  this is to retrieve all of the current matches
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/signup',
  failureFlash: true,
}));

//  This first checks if a user alread exists
//  If this call only checks username, send true aka go-ahead
//  If call is made with all fields, create the new user
app.post('/signup', async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username });
    if (user) {
      res.status(400).send(false);
    }
    if (!req.body.name) {
      res.status(200).send(true);
    }
    const options = req.body;
    const newUser = await User.create(options);
    req.login(newUser, () => res.send(newUser.id));
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);
