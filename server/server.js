// Importing required modules

const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser")
const jwt = require('./helpers/jwt');

const morgan = require("morgan")
const multer = require("multer")
const path = require("path")
const fs = require("fs")

// parse env variables
require('dotenv').config();

require("./helpers/db/mongodb.js")();

// Configuring port
const port = process.env.PORT || 8081;

const app = express();

// Configure middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("combined"))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(cors())

// use JWT auth to secure the api
app.use(jwt());

app.set('view engine', 'html');

// Static folder
app.use(express.static(__dirname + '/views/'));

// Defining route middleware
app.use('/api/users', require('./routes/users'));

app.get("/*", (req, res) => {
  res.send({
    failure: 'No Route ' + req.protocol + '://' + req.get('host') + req.originalUrl
  });
})

// Listening to port
app.listen(port);
console.log(`Listening On http://localhost:${port}`);

module.exports = app;
