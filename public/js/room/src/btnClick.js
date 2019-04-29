var btnClick = function(func){
	if(func === 'leaveGame')
		socket.emit(func, "player state");
	socket.emit(func, $('#msg').val());
}

document.onkeydown = function(event){
	if(event.keyCode === 13){	//enter
		event.preventDefault();
		socket.emit('chatMsg', $('#msg').val());
	}
}

var roomTag_copy = function(){
	let btn = document.getElementById("roomTag");
	let txt = document.createElement("textarea");
	let roomtag = roomTag();
	txt.value = roomtag;
	document.body.appendChild(txt);
	txt.select();
	document.execCommand('copy');
	btn.setAttribute('data-tooltip', "已複製至剪貼簿: " + roomtag);
	setTimeout(function() {
		btn.removeAttribute('data-tooltip');
		document.body.removeChild(txt);
	}, 1000);
}