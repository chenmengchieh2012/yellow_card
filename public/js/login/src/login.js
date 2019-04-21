var hashFunc = function(s){
	for(var i = 0, h = 0xdeadbeef; i < s.length; i++)
        h = Math.imul(h ^ s.charCodeAt(i), 2654435761);
    return (h ^ h >>> 16) >>> 0;
};

var login = function(playerInfo){
	let playerAvatar = playerInfo.playerAvatar ? \
		Avatar_list[playerInfo.playerAvatar] : Avatar_list[0];
	let playerName = (playerInfo.playerName.length > 0) ? \
		playerInfo.playerName : Math.floor(Date.now() / 1000).toString();
	let roomTag = (playerInfo.roomTag.length > 0) ? \
		playerInfo.roomTag: "";
};