var data = getCookie();
var startGame = function(){
	// if(onlineList.length > 3){
	// 	// swal("成功!", "但是我還沒寫同步進入遊戲", "success");
	// 	socket.emit('startGame', {
	// 		hashTag: data.roomtag,
	// 		msg: {
	// 			playerID: data.playerID,
	// 			playerName: data.playerName,
	// 			avatarIndex: data.playerAvatar
	// 		}
	// 	});
	// }else{
	// 	swal("注意!", "玩家人數須滿4人", "error");
	// }

	socket.emit('startGame', {
		hashTag: data.roomtag,
		msg: {
			playerID: data.playerID,
			playerName: data.playerName,
			avatarIndex: data.playerAvatar
		}
	});
}