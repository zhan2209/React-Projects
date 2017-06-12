var Board = require('./Board');
var AIPlayer = require('./AIPlayer');
var gameStat = require('./GameStat');
var symbol = require('./BoardParams').symbol;
var Utility = require('./Utility');
const constSet = require('./ConstSet');
const timerParams = require('./TimerParams');
var TimerConvert = require('./TimerConvert');
var timerConvert = new TimerConvert();

var Room = function() {
  this.board = new Board();
  this.aiPlayer = new AIPlayer(this.board, symbol.PLAYER2, symbol.PLAYER1);
  this.lastActive = "";
}

Room.prototype.playWithAI = function(num) {
  var pos = constSet.NULL;
  if (!this.board.gameOver() && this.board.setValByNum(num, symbol.PLAYER1)) {
  	var pos = this.aiPlayer.next();
  	if (pos != constSet.NULL) {
      this.board.setValue(pos, symbol.PLAYER2);
    }
  }
  var posNum = (pos != constSet.NULL? Utility.pos2Num(pos): constSet.NULL);
  var res = this.board.checkStat();
  return {pos: posNum, status: res.status, posNums: res.posNums};
}

Room.prototype.setLastActive = function(time) {
  this.lastActive = time;
}

Room.prototype.isTimeout = function(curTime) {
  if (timerConvert.getMinutes(this.lastActive, curTime) >= timerParams.TIMEOUT) {
    return true;
  }
  return false;
}

module.exports = Room;