var boardParams = require('./BoardParams').boardParams;
var Utility = function() {
  this.num2Pos = num2Pos;
  this.pos2Num = pos2Num;
}

var num2Pos = function(num) {
  var layer = Math.floor(num / (boardParams.WIDTH * boardParams.HEIGHT));
  var row = Math.floor(num % (boardParams.WIDTH * boardParams.HEIGHT) 
  	                   / boardParams.WIDTH);
  var col = num % (boardParams.WIDTH * boardParams.HEIGHT) 
  	        % boardParams.WIDTH;
  return {layer: layer, row: row, col: col};
}

var pos2Num = function(pos) {
  return pos.layer * boardParams.WIDTH * boardParams.HEIGHT
         + pos.row * boardParams.WIDTH + pos.col;
}

module.exports = new Utility();