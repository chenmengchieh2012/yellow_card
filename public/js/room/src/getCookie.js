var roomTag = function(){
	let cookies = document.cookie;
	console.log(cookies);
	// let re = /.AspNet.Consent=yes; roomtag=(.+)/;
	let re = /roomtag=(.+)/;
	let roomtag = re.exec(cookies.toString()); 
	console.log(roomtag[1]);
	return roomtag[1];
}