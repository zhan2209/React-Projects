const bcrypt = require('bcrypt');
var userColl = "userdb";
var usrNameRM = require('./recommendUsrName').recommendName;

module.exports = {
  checkUserName: function(db, user, res) {
    db.collection(userColl).find({"username": user.name}).limit(1).toArray(function(err, results) {
      if (err) {
        throw err;
      }
      else {
        if (results.length > 0) {
          db.collection(userColl).find({username: {$regex: user.name}}).toArray(function(suberr, subresults){
            if(suberr){
              throw err;
            }
            else{
              console.log("the subresults is:" + subresults.length);
              var recName = usrNameRM(subresults, user.name);
              res.send({
                success: false,
                errors: { name: 'username has been used ' + 'recommendName:' + '\n' +recName }
              });
            }
          })
        }
        else {
          bcrypt.genSalt((saltError, salt) => {
              if (saltError) { console.log('saltError:', saltError); }
              bcrypt.hash(user.password, salt, (hashError, hash) => {
                if (hashError) { console.log('hashError:', hashError); }
                db.collection(userColl).insert({"username": user.name, "password": hash});
              });
          });
          res.send({
            success: true,
            errors: {}
          });
        }
      }
    });
  },
};
