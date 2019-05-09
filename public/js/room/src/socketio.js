var socket = io({autoConnect: true});
socket.emit('join_chat_room', {
	"roomtag": localData.roomTag
});
socket.on('chatMsg', function(res){
	console.log("get msg");
	chat(res);
});
socket.on('playerState', function(state){
	playerState(state);
});
socket.on('startGame', function(playground){
	startGame(playground);
});