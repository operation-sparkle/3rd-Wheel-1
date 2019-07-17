const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const app = express();

app.use(express.static(path.join(__dirname, '../client')));
app.use(bodyParser.json());

passport.use(new LocalStrategy((username, password, done) => {
  //  find user
  //    check for user and valid password
  //  return done with the user
}));

app.get('/', (req, res) => {
  res.status(200).render('index');
});

app.get('/login', (req, res) => {

});

app.get('/signup', (req, res) => {

});

const PORT = process.env.PORT || 3000;
app.listen(PORT);
