var socket = io({autoConnect: true});
var data = getCookie();

//=====================================
// init the room
//=====================================
socket.on('connect', function(){
	console.log("init room");
	socket.emit('init_room', {
		roomtag: data.roomtag,
		playerID: data.playerID,
		playerName: data.playerName,
		avatarIndex: data.playerAvatar
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
	$.each(state, function(key, value){
		console.log("key: " + key);
		console.log("value: " + value);
		playerState(value);
	});
	// playerState(state);
});

//=====================================
// init the room
//=====================================
socket.on('startGame', function(playground){
	startGame(playground);
});
