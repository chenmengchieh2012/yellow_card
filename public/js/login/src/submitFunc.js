function __hiddenFiled_generator(self){
	let hiddenField = document.createElement(self.tag);
	hiddenField.setAttribute("name", self.name);
	hiddenField.setAttribute("id", self.name);
	hiddenField.setAttribute("type", self.type);
    hiddenField.setAttribute("value", self.value);

    return hiddenField
}

var submitFunc = function(self){
	var data = {
		playerid: self.msg.playerID,
		roomid: self.msg.roomID,
		playername: self.msg.playerName
		// playeravatar: self.msg.playerAvater
	};

	document.cookie = "roomtag=" + /*self.msg.roomTag*/"testhashtag";

	var form = document.createElement('form');
	form.setAttribute("action", "/" + self.func);
	form.setAttribute("method", "post");
	form.setAttribute("id", "playerinfo");

 	let table = [{
 		name: 'event',
 		value: "join"
 	},{
 		name: 'hashTag',
 		value: self.msg.roomTag
 	},{
 		name: 'msg',
 		value: JSON.stringify(data)
 	}];

 	for(var key in table){
 		let elemet = __hiddenFiled_generator({
 			tag: 'input',
 			name: table[key].name,
 			type: 'hidden text',
 			value: table[key].value
 		});
 		form.appendChild(elemet);
 	}
    document.body.appendChild(form);
    form.submit();
    // document.getElementById("playerinfo").submit();
    return true;
}