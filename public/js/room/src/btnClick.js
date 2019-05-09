var btnClick = function(func){
	if(func === 'chatMsg'){
		let msgData = form_msgData();
		MsgBlock_Factory(msgData, 'transmitted');
		socket.emit('chatMsg', msgData);
		$('#msg-input').val('');
	}else{
		// socket.emit(func, "player state"); // leave or start game
	}
}

document.onkeydown = function(event){
	if(event.keyCode === 13){	//enter
		event.preventDefault();
		let msgData = form_msgData();
		MsgBlock_Factory(msgData, 'transmitted');
		socket.emit('chatMsg', msgData);
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

var form_msgData = function(){
	let self = {
		avatarIndex: localData.playerAvatar,
		msg: $('#msg-input').val(),
		playerName: localData.playerName
	};
	return self;
}