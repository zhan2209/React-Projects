var numberString = "0123456789";
function addWord(word, trie){
	var current = trie;
	for(var i = 0; i < word.length; i++){
		var c = word.charAt(i);
		if(!(current[c])){
			current[c] = {};
		}
		current = current[c];
	}
	current.key = word;
}

function traverseTree(trie, userName){
	var current = trie;
	for(var i = 0; i < userName.length; i++){
		var c = userName.charAt(i);
		current = current[c];
	}
	return current;
}

function recommendName(userNames, userName){
	var trie = {};
	var rName = "";
	for(var i = 0; i < userNames.length; i++){
		addWord(userNames[i].username, trie);
	}
	var current = traverseTree(trie, userName);
	var count = 3;
	var next = {};
	while(count > 0){
		for(var i = 0; i < numberString.length && count > 0; i++){
			var c = numberString.charAt(i);
			if(current[c] == undefined || current[c].key == undefined){
				count --;
				rName = rName + userName + c + "\n";
			}else{
				next = current[c];
			}
		}
		current = next;
	}
	return rName;
}
module.exports = {
	recommendName : recommendName
}

