var btnClick = function(func){
	if(func === 'chatMsg'){
		let msgData = form_msgData();
		MsgBlock_Factory(msgData, 'transmitted');
		socket.emit('chatMsg', msgData);
		$('#msg-input').val('');
	}else if(func === 'leaveGame'){
		swal({
			title: "您將離開遊戲!",
		    text: "確定是否離開?",
		    icon: "warning",
		    buttons: ["不，我錯了", "對，我就是要離開"],
		    dangerMode: true,
		    closeOnConfirm: false,
		    closeOnCancel: false
		})
	    .then((isConfirm) => {
	    	if(isConfirm){   
	        	window.location.reload();
	        }else{     
	            swal("沒事沒事", "下次小心點");   
	        }
	    });
	}else if(func === 'startGame'){
		startGame();
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
	let data = getCookie();
	let self = {
		avatarIndex: data.playerAvatar,
		msg: $('#msg-input').val(),
		playerName: data.playerName,
		playerid: data.playerID,
		roomtag: data.roomTag
	};
	return self;
}