// setInterval(function(){
// 	let res = {
// 		playerAvatar: "2",
// 		msg: "AAAAAA",
// 		playerName: "123"
// 	};
// 	chat(res);
// 	console.log("received msg");
// }, 1500);

setTimeout(function() {
	let res = {
		playerAvatar: "10",
		msg: "我來打一些垃圾訊息了 :D",
		playerName: "玩家 1"
	};
	chat(res);
	setTimeout(function() {
		let res = {
			playerAvatar: "10",
			msg: "我來打一些垃圾訊息了 :D",
			playerName: "玩家 1"
		};
		chat(res);
		setTimeout(function() {
			let res = {
				playerAvatar: "10",
				msg: "我來打一些垃圾訊息了 :D",
				playerName: "玩家 1"
			};
			chat(res);
		}, 3000);
	}, 3000);
}, 3000);