var Observer = function(){

	var self = {
		observers:[]
	};

	var id_list = [];

	self.getList = function(){
		return id_list;
	}

	self.log = function(){
		self.observers.forEach(observer =>{
			console.log(observer);
		});
	}

	self.__createFollower = function(follower){
		let f = {
			id: follower.id,
			state: follower.state,
			time: follower.time,
			action: follower.action
		};

		return f;
	}

	self.subscribe = function(follower){
		console.log("subscribe");
		let f = self.__createFollower(follower)
		self.observers.push(f);
		id_list.push(f.id);
		self.log();
	}

	self.unsubscribe = function(follower){
		console.log("unsubscribe");
		if(self.observers.length != 0){
			let index = 0;
			self.observers.forEach(observer =>{
				if(observer.id === follower.id){
					console.log(index);
					self.observers.splice(index, 1);
					id_list.splice(index, 1);
					self.log();
				}
				index += 1;
			});
		}
	}

	self.__timeout = function(follower){
		console.log("time's out");
		follower.action(follower);
	}
	
	self.watcher = function(seconds){
		setInterval(function() {
			self.observers.forEach(follower =>{
				let nowtime = Math.floor(Date.now() / 1000);
				if((nowtime - follower.time) > seconds)
					self.__timeout(follower);
			});
		}, 1000/25);
	}

	return self;
}