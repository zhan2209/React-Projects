var boardParams = require('./BoardParams').boardParams;
var symbol = require('./BoardParams').symbol;
var gameStat = require('./GameStat');
var Utility = require('./Utility');
var directions = [[0, 0, 1], 
                  [0, 1, 0], 
                  [1, 0, 0],
                  [0, 1, 1],
                  [0, 1, -1],
                  [1, 1, 1],
                  [-1, 1, 1],
                  [-1, -1, 1],
                  [1, -1, 1],
                  [1, 0, 1],
                  [-1, 0, 1],
                  [1, 1, 0],
                  [-1, 1, 0]];


var Board = function() {
  this.board = getBoard();
  this.starts = getAllStarts();
  this.directions = directions;
}

var getBoard = function() {
  var board = new Array(boardParams.LAYERNUM);
  for (var i = 0; i < boardParams.LAYERNUM; i++) {
  	board[i] = new Array(boardParams.HEIGHT);
  	for (var j = 0; j < boardParams.HEIGHT; j++) {
      board[i][j] = new Array(boardParams.WIDTH).fill(null);
  	}
  }
  return board;
}

Board.prototype.setValue = function(pos, value) {
  if (this.board[pos.layer][pos.row][pos.col] === null) {
    this.board[pos.layer][pos.row][pos.col] = value;
    return true;
  }
  return false;
}

Board.prototype.resetValue = function(pos) {
	this.board[pos.layer][pos.row][pos.col] = null;
}

Board.prototype.getAllAvaPos = function() {
  var positions = [];
  for (var i = 0; i < boardParams.LAYERNUM; i++) {
  	for (var j = 0; j < boardParams.HEIGHT; j++) {
  	  for (var m = 0; m < boardParams.WIDTH; m++) {
        if (this.board[i][j][m] === null) {
          positions.push({layer: i, row: j, col: m});
        }
  	  }
  	}
  }
  return positions;
}

Board.prototype.calOnePos = function(pos, directions) {
  var cur = {layer: pos.layer, row: pos.row, col: pos.col};
  var res = [];
  for (var i = 0; i < directions.length; i++) {
    var count = 4;
    var player1Num = 0;
    var player2Num = 0;
    var posNums = [];
    for (; count > 0 && this.isLegalPos(cur); count--) {
      var sym = getSymbol(cur, this.board);
      posNums.push(Utility.pos2Num(cur));
      if (sym == symbol.PLAYER1) {
        player1Num++;
      } else if (sym == symbol.PLAYER2) {
        player2Num++;
      }
      cur = this.getNextPos(cur, directions[i]);
    }
    if (count == 0) {
      res.push({player1Num: player1Num, player2Num: player2Num, posNums: posNums});
    }
    cur = {layer: pos.layer, row: pos.row, col: pos.col};
  }
  return res;
}

Board.prototype.setValByNum = function(num, symbol) {
  var pos = Utility.num2Pos(num);
  return this.setValue(pos, symbol);
}


Board.prototype.calRes = function() {
  var results = [];
  for (var i = 0; i < this.starts.length; i++) {
    var result = this.calOnePos(this.starts[i], this.directions);
    results.push(result);
  }
  return results;
}

Board.prototype.gameOver = function() {
  var status = this.checkStat().status;
  return status != gameStat.UNFINISHED;
}

Board.prototype.checkStat = function() {
  var results = this.calRes();
  for (var i = 0; i < results.length; i++) {
  	for (var j = 0; j < results[i].length; j++) {
  	  if (results[i][j].player1Num == boardParams.WIDTH) {
  	  	return {status: gameStat.PLAYER1WIN, posNums: results[i][j].posNums};
  	  } else if (results[i][j].player2Num == boardParams.WIDTH) {
  	  	return {status: gameStat.PLAYER2WIN, posNums: results[i][j].posNums};
  	  }
  	}
  }
  var avaPos = this.getAllAvaPos();
  if (avaPos.length == 0) {
  	return {status: gameStat.DRAW, posNums: []};
  }
  return {status: gameStat.UNFINISHED, posNums: []};
}

Board.prototype.evaluate = function(results, targetSymbol) {
  var evaluation = 0;
  for (var i = 0; i < results.length; i++) {
  	for (var j = 0; j < results[i].length; j++) {
  	  if (results[i][j].player1Num == 0) {
  	  	var base = results[i][j].player2Num;
        evaluation += base * (targetSymbol == symbol.PLAYER2? 1 : -1) * Math.pow(20, base)
  	  } 
      if (results[i][j].player2Num == 0) {
        var base = results[i][j].player1Num;
        evaluation += base * (targetSymbol == symbol.PLAYER1? 1 : -1) * Math.pow(20, base);
      }
  	}
  }
  return evaluation;
}



Board.prototype.getNextPos = function(cur, direction) {
  var next = {layer: cur.layer + direction[0],
              row: cur.row + direction[1],
              col: cur.col + direction[2]};
  return next;
}

Board.prototype.isLegalPos = function(pos) {
  return pos.layer >= 0 && pos.layer < boardParams.LAYERNUM
         && pos.row >= 0 && pos.row < boardParams.HEIGHT
         && pos.col >= 0 && pos.col < boardParams.WIDTH;
}

Board.prototype.isSameValue = function(pos1, pos2) {
  return this.board[pos1.layer][pos1.row][pos1.col] === this.board[pos2.layer][pos2.row][pos2.col]
}

var getAllStarts = function() {
  var starts = [];
  for (var i = 0; i < boardParams.LAYERNUM; i++) {
  	for (var j = 0; j < boardParams.HEIGHT; j++) {
  	  for (var m = 0; m < boardParams.WIDTH; m++) {
  	  	if ((i == 0 || j == 0 || m == 0)) {
         starts.push({layer: i, row: j, col: m});
  	  	}
  	  }
  	}
  }
  return starts;
}

var getSymbol = function(pos, board) {
  return board[pos.layer][pos.row][pos.col];
}

Board.prototype.showBoard = function() {
  for (var i = 0; i < boardParams.LAYERNUM; i++) {
    println(4);
    for (var j = 0; j < boardParams.HEIGHT; j++) {
      var s = "";
      for (var m = 0; m < boardParams.WIDTH; m++) {
        s = s +'[' + this.board[i][j][m] + ']';
      }
      console.log(s);
    }
  }
}

var println = function(num) {
  for (var i = 0; i < num; i++) {
    console.log();
  }
}

module.exports = Board;