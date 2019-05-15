var roomTag = function(){
	let cookies = document.cookie;
	let re = /roomtag=(.+)/;
	let roomtag = re.exec(cookies.toString()); 
	console.log(roomtag[1]);
	return roomtag[1];
}

function getCookie(){
	let self = {};
	let cookies = document.cookie;
	console.log("cookies: " + cookies);
	let re = /playerName=(\w+)/;
	self.playerName = re.exec(cookies.toString())[1];
	re = /playerAvatar=(\w+)/;
	self.playerAvatar = re.exec(cookies.toString())[1];
	re = /playerID=(\w+)/;
	self.playerID = re.exec(cookies.toString())[1];
	re = /roomID=(\w+)/;
	self.poomID = re.exec(cookies.toString())[1];
	re = /roomTag=(\w+)/;
	self.roomtag = re.exec(cookies.toString())[1];
	// console.log(self);
	return self;
}