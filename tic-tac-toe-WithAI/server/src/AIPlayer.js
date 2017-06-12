var aiParams = require('./AIPlayerParams').AIparams;
var gameStat = require('./GameStat');
const constSet = require('./ConstSet');
var AIPlayer = function(board, symbol, oppSymbol) {
  this.board = board;
  this.symbol = symbol;
  this.oppSymbol = oppSymbol;
  this.level = aiParams.LEVEL;
  this.nextPos = constSet.NULL;
}

AIPlayer.prototype.next = function() {
  this.nextStep(this.level, -Infinity, Infinity, true);
  return this.nextPos;
}


AIPlayer.prototype.nextStep = function(level, a, b, maxingPlayer) {
  if (level === 0 || this.board.checkStat().status !== gameStat.UNFINISHED) {
  	var results = this.board.calRes();
  	return this.board.evaluate(results, this.symbol);
  } else if (maxingPlayer) {
  	var v = -Infinity;
  	var allAvaPos = this.board.getAllAvaPos();
  	for (var i = 0; i < allAvaPos.length; i++) {
  	  this.board.setValue(allAvaPos[i], this.symbol);
  	  v = Math.max(v, this.nextStep(level - 1, a, b, false));
  	  if (v > a) {
  	  	a = v;
  	  	if (level == this.level) {
  	  	  this.nextPos = allAvaPos[i];
  	  	}
  	  }
  	  this.board.resetValue(allAvaPos[i]);
  	  if (b <= a) {
  	  	break;
  	  }
  	}
  	return v;
  } else {
    var v = Infinity;
    var allAvaPos = this.board.getAllAvaPos();
    for (var i = 0; i < allAvaPos.length; i++) {
      this.board.setValue(allAvaPos[i], this.oppSymbol);
      v = Math.min(v, this.nextStep(level - 1, a, b, true));
      b = Math.min(b, v);
      this.board.resetValue(allAvaPos[i]);
      if (b <= a) {
      	break;
      }
    }
    return v;
  }
}

module.exports = AIPlayer;