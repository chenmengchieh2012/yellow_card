var playerState = function(socket){
	// refresh player state
	setInterval(function() {
		// player_state();
	}, 1000)
}

var playerInfo = function(){

}

var roomTag = function(){
	let cookies = document.cookie;
	console.log(cookies);
	let re = /.AspNet.Consent=yes; roomtag=(.+)/;
	let roomtag = re.exec(cookies.toString()); 
	console.log(roomtag[1]);
	return roomtag[1];
}
