var hashFunc = function(s){
	for(var i = 0, h = 0xdeadbeef; i < s.length; i++)
        h = Math.imul(h ^ s.charCodeAt(i), 2654435761);
    return (h ^ h >>> 16) >>> 0;
};

var timestamp = function(){
	return Math.floor(Date.now() / 1000);
}

var setCookie = function(self){
	document.cookie = "playerName=" + self.playerName;
	document.cookie = "playerAvatar=" + self.playerAvatar;
	document.cookie = "playerID=" + self.playerID;
	document.cookie = "roomTag=" + self.roomTag;
	document.cookie = "roomID=" + self.roomID;
}

var get_playerInfo = function(func){
	let self = {};
	let T = timestamp();
	let playerName = document.getElementById("playerName").value;
	let roomTag = document.getElementById("roomTag").value;
	let avatar_index = document.getElementById("playerAvatar").getAttribute("alt");
	if(func === 'joinroom' && roomTag.length < 6){
		self.roomTag = false;
	}else if(func === 'joinroom' && roomTag.length > 0){
		self.roomID = hashFunc(roomTag);
		self.roomTag = roomTag;
	}else if(func === 'createroom'){
		self.roomTag = Math.floor((Math.random() * 999999) + 100000);
		self.roomID = hashFunc(self.roomTag.toString());
	}
	self.playerName = (playerName.length > 0) ? playerName : T.toString();
	self.playerID = hashFunc(self.playerName);
	self.playerAvatar = avatar_index;

	console.log(JSON.stringify(self));
	
	setCookie(self);
	
	return self;
};