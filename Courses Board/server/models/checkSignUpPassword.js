var specialString = require('./passwordCheckCode').specialString;
var pswCheckcode = require('./passwordCheckCode').pswCheckcode;
function isSpecialCharacter(c){
	for(var index = 0; index < specialString.length; index++){
		if(specialString.charAt(index) == c){
			return true;
		}
	}
	return false;
}

function checkValid(password){
	var special =1, upLetter = 1, number = 1, index = 0;
	while(index < password.length && (special == 1 || number == 1 || upLetter == 1)){
		var c = password.charAt(index);
		if(c >= '0' && c <= '9'){
			number--;
		}else if(isSpecialCharacter(c)){
			special--;
		}else if(c >= 'A' && c <= 'Z'){
			upLetter--;
		}
		index++;
	}
	if(password.length < 8){
		return pswCheckcode.SHORT_ERR;
	}else if(number > 0){
		return pswCheckcode.NUMBER_ERR;
	}else if(upLetter > 0){
		return pswCheckcode.LETTER_ERR;
	}else if(special > 0){
		return pswCheckcode.SPECIAL_ERR;
	}else{
		return pswCheckcode.SUCCESS;
	}
}
module.exports.checkValid = checkValid;