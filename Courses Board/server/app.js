var express = require('express');
var fs = require('fs');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const passport = require('passport');

var routes = require('./routes/index');
var cars = require('./routes/cars');
const localLoginStrategy = require('./passport/login');

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', routes);
app.use(passport.initialize());
passport.use('login', localLoginStrategy);
app.use('/api', cars);

var reactBase = path.resolve(__dirname, '../client/build')
if (!fs.existsSync(reactBase)) {
  throw 'TODO, need to `npm run build` in client dir'
}
app.use('/static', express.static(path.join(reactBase, 'static')));
// app.use(express.static(reactBase));
var indexFile = path.join(reactBase, 'index.html')
app.use(function(req, res, next) {
  // TODO - catch errors http://expressjs.com/en/api.html#res.sendFile
  res.sendFile(indexFile);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;