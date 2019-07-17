const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const app = express();

app.use(express.static(path.join(__dirname, '../client')));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.status(200).render('index');
});

app.get('/login', (req, res) => {

});

app.get('/signup', (req, res) => {

});

const PORT = process.env.PORT || 3000;
app.listen(PORT);
