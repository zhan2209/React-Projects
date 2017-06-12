
var RoomCleaner = function(rooms) {
  var self = this;
  this.rooms = rooms;
  this.timer = setInterval(function() {
     self.removeRoom();
  }, 120000);
}

RoomCleaner.prototype.removeRoom = function() {
  for (var key in this.rooms) {
  	if (this.rooms[key].isTimeout(new Date().getTime())) {
  	  delete this.rooms[key];
  	}
  }
}

RoomCleaner.prototype.removeRoomByName = function(name) {
  if (this.rooms.hasOwnProperty(name)) {
    delete this.rooms[name];
  }
}

module.exports = RoomCleaner;