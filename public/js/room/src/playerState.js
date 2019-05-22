var observer = Observer();

observer.watcher(30); //30 seconds

var onlineList = [];

var playerState = function(self){
	console.log(self.playerName + ":" + self.state);
	let list = observer.getList();
	let found_inOffline = false;
	let found_inOnline = false;
	list.forEach(member =>{
		if(member === self.playerID){
			found_inOffline = true;
		}
	});
	onlineList.forEach(member =>{
		if(member === self.playerID){
			found_inOnline = true;
		}
	});
	let action = (found_inOffline || found_inOnline)? 'change':'append';
	console.log(action);
	self.action = action;
	StateBlock_Manager(self);
}

var form_playerData = function(self, action){
	self.action = action;
	return self;
}

var removeState = function(self){
	let index = onlineList.indexOf(self.playerID);
	onlineList.splice(index, 1);
	observer.unsubscribe(self);
	let selector = 'li[id=\"' + self.id + '\"]';
	$(selector).remove();
	console.log('remove completed');
}

var appendState = function(self){
	onlineList.push(self.playerID);
	//one line: rgb(1, 178, 104);
	//off line: rgb(255, 82, 82);
	let state_block = "\
		\<li id=\"" + self.playerID + "\"\>\
			\<img src=\"js/avatar_img/" + self.avatarIndex + ".png\"\
    			alt=\"" + self.avatarIndex + "\"\
    			 id=\"player-list-avatar\" \/\>\
    		\<div \
    			style=\"text-align: center; width: 80px\" \
    			id=\"" + self.playerID + "\"\>\
    			\<p style=\"color: rgb(1, 178, 104);\"\>" +
    				self.playerName + "\<\/p\>\
    		\<\/div\>\
		\<\/li\>";
	$('#list').append(state_block);
}

var createFollower = function(self){
	let follower = {
		id: self.playerID,
		state: self.state,
		time: Math.floor(Date.now() / 1000),
		action: removeState
	};
	return follower;
}

var changeState = function(self){
	let color = (self.state === 'offline')?
		"color: rgb(255, 82, 82);" : 
		"color: rgb(1, 178, 104);";
	$('div[id="' + self.playerID + '"]')
		.children()
		.attr('style', color);

	// use the method of create an unique object
	let follower = createFollower(self);

	if(self.state === 'offline')
		observer.subscribe(follower);
	else
		observer.unsubscribe(follower);
}

function StateBlock_Manager(self){
	let actions = {};
	actions['append'] = appendState;
	actions['change'] = changeState;
	let func = actions[self.action];
	func(self);
}
