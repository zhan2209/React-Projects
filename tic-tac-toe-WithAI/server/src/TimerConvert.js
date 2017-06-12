var TimerConvert = function() {

}

TimerConvert.prototype.getMinutes = function(prev, cur) {
  return Math.floor((cur - prev) / 60000);
}

module.exports = TimerConvert;