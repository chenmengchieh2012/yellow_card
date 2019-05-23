var socket = io({autoConnect: true});
var data = getCookie();

//=====================================
// init the room
//=====================================
socket.on('connect', function(){
	console.log("init room");
	socket.emit('init_room', {
		event: "newplayer",
		hashTag: data.roomtag,
		msg: {
			playerID: data.playerID,
			playerName: data.playerName,
			avatarIndex: data.playerAvatar
		}
	});
	socket.emit('client_message', {
		event: "setsocket",
		hashTag: data.roomtag,
		msg: {
			playerid: data.playerID
		}
	});
});

//=====================================
// chat messages
//=====================================
socket.on('chatMsg', function(res){
	console.log("get msg");
	chat(res);
});

//=====================================
// init the room
//=====================================
socket.on('playerState', function(state){
	console.log('playerState update!\n' + JSON.stringify(state));
	$.each(state.playerlist, function(playerid, value){
		console.log("playerid: " + playerid);
		console.log("value: " + JSON.stringify(value));
		playerState(value);
	});
});

//=====================================
// init the room
//=====================================
socket.on('ready', function(readylist){
	console.log("readylist: " + JSON.stringify(readylist));
	let playerNumber = readylist.playerNumber;
	let readyNumber = readylist.readyNumber;
	$.each(readylist.readylist, function(playerid, value){
		console.log("playerid: " + playerid);
		console.log("value: " + JSON.stringify(value));
		// waiting for all the players are ready to play
		// $('li[id="' + playerid + '"] div:nth-child(2) > div')
		// 	.attr('style', 'display: block;');
	});
});

//=====================================
// get in playground
//=====================================
socket.on('startGame', function(playerlist){
	
});

