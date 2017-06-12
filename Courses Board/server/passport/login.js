const jwt = require('jsonwebtoken');
const PassportLocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

var MongoClient = require('mongodb').MongoClient;
var mongoURI = 'mongodb://ds057176.mlab.com:57176/today';
var dbUser = "panjintian";
var dbPassword = "panjintian";
var userColl = "userdb";

module.exports = new PassportLocalStrategy({
  usernameField: 'name',
  passwordField: 'password',
  session: false,
  passReqToCallback: true
}, (req, name, password, done) => {
  MongoClient.connect(mongoURI,function(err,db){
    if (err)
      console.log('connect error');
    else {
      db.authenticate(dbUser, dbPassword, function(err,result){
        if(err)
          throw err;
        else {
          const userData = {
            name: name.trim(),
            password: password.trim()
          };

          db.collection(userColl).find({"username": userData.name}).limit(1).toArray(function(err, results) {
            if (err) {
              throw err;
            }
            else {
              if (results.length > 0) {
                bcrypt.compare(userData.password, results[0].password, (passwordErr, isMatch) => {
                  if (err) { return done(err); }

                  if (!isMatch) {
                    const error = new Error('Incorrect email or password');
                    error.name = 'IncorrectCredentialsError';
                    return done(error);
                  }

                  const payload = {
                    sub: userData._id
                  };

                  const token = jwt.sign(payload, 'this is a test');
                  const data = {
                    name: userData.name
                  };

                  return done(null, token, data);
                });
              } else {
                const error = new Error('Incorrect username or password');
                error.name = 'IncorrectCredentialsError';
                return done(error);
              }
            }
          });
        }
      });
    }
  })
});
