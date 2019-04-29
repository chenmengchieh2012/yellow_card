var socket = io();
socket.on('connection', function(listener){
	listener.on('chatMsg', function(data){
		chat(data);
	});
	listener.on('playerState', function(state){
		playerState(state);
	});
	listener.on('leaveGame', function(playerInfo){
		leaveGame(playerInfo);
	});
	listener.on('startGame', function(playground){
		startGame(playground);
	});
	listener.on('disconnect', function(playerInfo){

	});
});