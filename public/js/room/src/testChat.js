setInterval(function(){
	setTimeout(function() {
		let res = {
			avatarIndex: "17",
			msg: "所以泥好，再見!",
			playerName: "玩家 17"
		};
		chat(res);
	}, 1000);
	setTimeout(function() {
		MsgBlock_Factory({
			avatarIndex: localData.playerAvatar,
			msg: '好窩，你好 (｡ŏ_ŏ)',
			playerName: localData.playerName
		}, "transmitted");
	}, 3000);
	setTimeout(function() {
		let res = {
			avatarIndex: "19",
			msg: "我也來打一些垃圾訊息給你們看看 www",
			playerName: "玩家 19"
		};
		chat(res);
	}, 5000);
	setTimeout(function() {
		MsgBlock_Factory({
			avatarIndex: localData.playerAvatar,
			msg: '傻眼 ="=',
			playerName: localData.playerName
		}, "transmitted");
	}, 7000);
	setTimeout(function() {
		$('div[onclick="showTime()"]').remove();
	}, 9000);
}, 10000);