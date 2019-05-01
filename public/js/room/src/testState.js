setInterval(function() {
	// player 3 is online
	setTimeout(function(){
		playerState({
			playerID: '3',
			playerName: 'player 3',
			avatarIndex: '13',
			state: 'online'
		});
	}, 2000);
	// player 4 is online
	setTimeout(function(){
		playerState({
			playerID: '4',
			playerName: 'player 4',
			avatarIndex: '14',
			state: 'online'
		});
	}, 2000);
	// player 5 is online
	setTimeout(function(){
		playerState({
			playerID: '5',
			playerName: 'player 5',
			avatarIndex: '15',
			state: 'online'
		});
	}, 2000);
	// player 3 is offline
	setTimeout(function(){
		playerState({
			playerID: '3',
			playerName: 'player 3',
			avatarIndex: '13',
			state: 'offline'
		});
	}, 4000);
	// player 5 is offline
	setTimeout(function(){
		playerState({
			playerID: '5',
			playerName: 'player 5',
			avatarIndex: '15',
			state: 'offline'
		});
	}, 4000);
	// player 3 is online
	setTimeout(function(){
		playerState({
			playerID: '3',
			playerName: 'player 3',
			avatarIndex: '13',
			state: 'online'
		});
	}, 6000);
	// player 3 is offline
	setTimeout(function(){
		playerState({
			playerID: '3',
			playerName: 'player 3',
			avatarIndex: '13',
			state: 'offline'
		});
	}, 8000);
	// player 4 is offline
	setTimeout(function(){
		playerState({
			playerID: '4',
			playerName: 'player 4',
			avatarIndex: '14',
			state: 'offline'
		});
	}, 8000);
}, 20000);

