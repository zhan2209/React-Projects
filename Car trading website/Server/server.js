var express = require('express');
var fs = require('fs');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var MongoClient = require('mongodb').MongoClient;
var mongoURI='mongodb://ds057176.mlab.com:57176/today';
var db_user="panjintian";
var db_password="panjintian";
var collectName="AISnakeCollection";

const api = require('./routes/api');
const localLoginStrategy = require('./passport/login');
const passport = require('passport');

MongoClient.connect(mongoURI, function(err, db){
  if (err) {
    throw err;
  }
  else {
    db.authenticate(db_user, db_password, function(err, result) {
      if (err) {
        throw err;
      }
      else {
        app = express();

        app.use(logger('dev'));
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(cookieParser());

        app.use(passport.initialize());
        passport.use('login', localLoginStrategy);
        app.use('/api', api);

        var port = process.env.PORT || 3000; // For when we deploy to Heroku
        var server = app.listen(port)

      }
    })
  }
})
