const GameStat = require('./GameStat');
var Room = require('./Room');
var RoomCleaner = require('./RoomCleaner');
var RoomManager = function() {
  this.rooms = {};
  this.roomCleaner = new RoomCleaner(this.rooms);
}

RoomManager.prototype.addRoom = function(roomName) {
  if (!this.rooms.hasOwnProperty(roomName)) {
  	this.rooms[roomName] = new Room();
  	this.rooms[roomName].setLastActive(new Date().getTime());
  	return true;
  }
  return false;
}

RoomManager.prototype.withAINext = function(roomName, num) {
  if (this.rooms.hasOwnProperty(roomName)) {
    this.rooms[roomName].setLastActive(new Date().getTime());
  	return this.rooms[roomName].playWithAI(num);
  }
  return {pos: -1, status: GameStat.TIMEOUT, posNums: []}
}

RoomManager.prototype.cleanRoom = function(roomName) {
  this.roomCleaner.removeRoomByName(roomName);
}

module.exports = RoomManager;