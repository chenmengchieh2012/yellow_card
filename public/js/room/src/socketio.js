var socket = io({autoConnect: true});
socket.on('chatMsg', function(res){
	chat(res);
});
socket.on('playerState', function(state){
	playerState(state);
});
socket.on('startGame', function(playground){
	startGame(playground);
});