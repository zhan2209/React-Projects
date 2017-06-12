var express = require('express');
var router = express.Router();
const passport = require('passport');
var request = require('request');
var mongodb = require('mongodb');
var userModel = require('../models/user');
var MongoClient = require('mongodb').MongoClient;
var mongoURI = 'mongodb://ds057176.mlab.com:57176/today';
var dbUser = "panjintian";
var dbPassword = "panjintian";
var userColl = "userdb";
var courseColl = "courses";
var pswChecker = require('../models/checkSignUpPassword').checkValid;
var pswCheckcode = require('../models/passwordCheckCode').pswCheckcode;
var specialString = require('../models/passwordCheckCode').specialString;
MongoClient.connect(mongoURI,function(err,db){
  if (err)
    console.log('connect error');
  else {
    db.authenticate(dbUser, dbPassword, function(err,result){
      if(err)
        throw err;
      else {
        router.post('/signup', function(req,res){
          var validateData = validateSignupForm(req.body);
          if (!validateData.success) {
            res.send(validateData);
          }
          else {
            userModel.checkUserName(db, req.body, res);
          }
        });

        router.post('/login', function(req,res){
          var validateData = validateLoginForm(req.body);
          if (!validateData.success) {
            res.send(validateData);
          }
          else {
            passport.authenticate('login', (err, token, userData) => {
              if (err) {
                res.send({
                  success: false,
                  message: 'Incorrect username or password'
                });
              } else {
                res.send({
                  success: true,
                  message: 'You have successfully logged in!',
                  token,
                  user: userData
                });
              }
            })(req, res);
          }
        });

        router.post('/addcourse', function(req,res){
          var slug = req.body.data.url.split('/');
          slug = slug[slug.length-1];
          request('https://api.coursera.org/api/courses.v1?fields=photoUrl&q=slug&slug='+slug, (error, response, body)=> {
            if (!error && response.statusCode === 200) {
              response = JSON.parse(body);
              var data = response.elements[0];
              data['username'] = req.body.username;
              data['url'] = req.body.data.url;
              data['description'] = req.body.data.description;
              data['tags'] = req.body.tags;
              db.collection(courseColl).find({"username": req.body.username, "name": data['name']}).toArray(function(err, results) {
                if (err) {
                  throw err;
                }
                else {
                  console.log(results)
                  if(results.length > 0) {
                    res.send({status: 'fail'});
                  }
                  else {
                    db.collection(courseColl).insert(data);
                    res.send({status: 'success'});
                  }
                }
              });
            }
          })
        });

        router.post('/display', function(req,res){
          db.collection(courseColl).find({"username": req.body.username}).toArray(function(err, results) {
            if (err) {
              throw err;
            }
            else {
              res.send(results);
            }
          });
        });

        router.post('/getallcourses', function(req,res){
          var filter = [
            { $group:
              {
                _id: '$name',
                total_saved: { $sum: 1 },
                users: { $addToSet: "$username" },
                tags: { $addToSet: "$tags" },
                description: { $addToSet: "$description" },
              }
            }
          ];
          if (req.body.keywords) {
            filter.unshift({$match:
                            {"name": new RegExp('\.*'+req.body.keywords+'\.', 'i') } })
          }
          db.collection(courseColl).aggregate(
            filter,
          	function (err, groups) {
          		if (err) return handleError(err);
              var datas = [];
              var itemsProcessed = 0;
              groups.forEach((item, index, array) => {
                db.collection(courseColl).findOne({"name": item._id}, function(err, ele) {
                  var data = ele;
                  var tagsArr = [];
                  delete data['_id'];
                  data['username'] = {};
                  data['tags'] = {};
                  item.users.forEach((ele) => data['username'][ele] = 1);
                  item.tags.forEach((ele) => tagsArr.push(...ele));
                  tagsArr.forEach((ele) => data['tags'][ele] = 1);
                  if (!req.body.tags || haveAllFilters(req.body.tags, data['tags'])) {
                    data['description'] = item.description;
                    datas.push(data);
                  }
                  itemsProcessed++;
                  if(itemsProcessed === array.length) {
                    res.send(datas);
                  }
                });
              });
          	}
          );
        });

        router.post('/editcourse', function(req,res){
          db.collection(courseColl).update(
            { "_id" : new mongodb.ObjectID(req.body.content.id) },
            { $set : {
              description : req.body.content.description,
              tags: req.body.tags,
            }}
          );
          res.send('success');
        });

        router.post('/bookmark', function(req,res){
          var datas = req.body;
          datas['tags'] = [];
          datas['description'] = '';
          db.collection(courseColl).insert(req.body);
          res.send('success');
        });

        router.post('/deletebookmark', function(req,res){
          db.collection(courseColl).remove({ "username": req.body.username, "id": req.body.id });
          res.send('success');
        });

        router.post('/getalltags', function(req,res){
          db.collection(courseColl).distinct("tags",(function(err, docs){
            res.send(docs);
          }))
        });

        router.post('/delete', function(req,res){
          db.collection(courseColl).remove({ "_id" : new mongodb.ObjectID(req.body.id) });
        });
      }
    });
  }
})

function haveAllFilters(tags, allTags) {
  var flag = true;
  tags.forEach((ele) => {
    if (!(ele in allTags)) {flag = false;}
  });
  return flag
}

function validateLoginForm(signUpData) {
  const errors = {};
  var isFormValid = true;
  var message = '';

  if (!signUpData || typeof signUpData.name !== 'string' || signUpData.name.trim().length === 0) {
    isFormValid = false;
    errors.name = 'Please provide your username.';
  }

  if (!signUpData || typeof signUpData.password !== 'string' || signUpData.password.trim().length === 0) {
    isFormValid = false;
    errors.password = 'Please provide your password.';
  }

  return {
    success: isFormValid,
    errors
  };
}

function validateSignupForm(signUpData) {
  const errors = {};
  var isFormValid = true;
  var message = '';

  if (!signUpData || typeof signUpData.password !== 'string') {
    isFormValid = false;
    errors.password = 'password should not be a null string';
  }
  else{
    var code = pswChecker(signUpData.password);
    isFormValid = false;
    if(code == pswCheckcode.SUCCESS){
      isFormValid = true;
    }else if(code == pswCheckcode.SHORT_ERR){
      errors.password = 'password length should not less than 8';
    }else if(code == pswCheckcode.NUMBER_ERR){
      errors.password = 'password should contain one digit at least';
    }else if(code == pswCheckcode.SPECIAL_ERR){
      errors.password = 'password should contain one of the following special character at least: ' + specialString;
    }else{
      errors.password = 'password should contain one UpperCase Letter at least';
    }
  }
  if (!signUpData || typeof signUpData.name !== 'string' || signUpData.name.trim().length === 0) {
    isFormValid = false;
    errors.name = 'Please provide your username.';
  }

  return {
    success: isFormValid,
    errors
  };
}

module.exports = router;
