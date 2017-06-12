var express = require('express');
var RoomManager = require('./RoomManager');
var router = express.Router();
var roomManager = new RoomManager();
router.post('/next', function(req, res){
  var result = roomManager.withAINext(req.body.roomName, req.body.pos);
  res.send(result);
});

router.post('/startGame', function(req, res) {
  res.send({success: roomManager.addRoom(req.body.roomName)});
});

router.post('/restartGame', function(req, res) {
  roomManager.cleanRoom(req.body.roomName);
  var success = roomManager.addRoom(req.body.roomName);
  res.send({success: success});
})
module.exports = router;

