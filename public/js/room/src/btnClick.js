var btnClick = function(func){
	if(func === 'chatMsg'){
		MsgBlock_Factory({
			avatarIndex: localData.playerAvatar,
			msg: $('#msg-input').val(),
			playerName: localData.playerName
		}, 'transmitted');
		// socket.emit(func, $('#msg-input').val());
		$('#msg-input').val('');
	}else{
		// socket.emit(func, "player state"); // leave or start game
	}
}

document.onkeydown = function(event){
	if(event.keyCode === 13){	//enter
		event.preventDefault();
		MsgBlock_Factory({
			avatarIndex: localData.playerAvatar,
			msg: $('#msg-input').val(),
			playerName: localData.playerName
		}, 'transmitted');
		// socket.emit('chatMsg', $('#msg-input').val());
		$('#msg-input').val('');
	}
}

var roomTag_copy = function(id){
	let snackbar = document.getElementById("snackbar");
	copyFunc(id, roomTag());
	snackbar.setAttribute('class', "ts active snackbar");
	setTimeout(function() {
		snackbar.setAttribute('class', "ts snackbar");
	}, 3000);
}