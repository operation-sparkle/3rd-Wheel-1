const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

app.use(express.static(path.join(__dirname, '../client')));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  app.status(200).render('index');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);
