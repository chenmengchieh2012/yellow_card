var hashFunc = function(s){
	for(var i = 0, h = 0xdeadbeef; i < s.length; i++)
        h = Math.imul(h ^ s.charCodeAt(i), 2654435761);
    return (h ^ h >>> 16) >>> 0;
};

var timestamp = function(){
	return Math.floor(Date.now() / 1000);
}

var Avatar_list = [];

var login = function(playerInfo){
	let self = {};
	let T = timestamp();
	self.playerAvatar = playerInfo.playerAvatar ? \
		Avatar_list[playerInfo.playerAvatar] : Avatar_list[0];
	self.playerName = (playerInfo.playerName.length > 0) ? \
		playerInfo.playerName : T.toString();
	self.roomTag = (playerInfo.roomTag.length > 0) ? \
		playerInfo.roomTag: T.toString();
	self.playerID = hashFunc(self.playerName);
	self.roomID = hashFunc(self.roomTag);

	return self;
};