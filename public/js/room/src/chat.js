var chat = function(res){
	if(localData.playerName !== res.playerName){
		MsgBlock_Factory({
			avatarIndex: res.avatarIndex,
			msg: res.msg,
			playerName: res.playerName
		}, "received");
	}
}

function __resetHTML(){
	$("#chat-container").html("");
}

function __scroll_to_bottom(){
	$("#chat-container").animate({scrollTop:
		$("#chat-container")[0].scrollHeight}, 1);
}

function showTime(){
	$('.time-code').attr('style', 'visibility:show');
	setTimeout(function() {
		$('.time-code').attr('style', 'visibility:hidden');
	}, 1500);
}

function TransmittedMessage(task){
	if(task.msg === "")
		return false;
	let self = {};
	let message_block = "\
		\<div class=\"ts grid\" onclick=\"showTime()\"\>\
			\<div class=\"one wide column\"\>\
		        \<p class=\'time-code\' \
		        	style=\"visibility:hidden; color:gray;\"\>" + 
		        	timecode() + "\<\/P\>\
		    \<\/div\>\
		    \<div class=\"thirteen wide column\"\>\
			    \<div class=\"ts outlined message\"\
			    	style=\"float: right;\" id=\"msg\"\>\
			    	" + task.msg + "\
			    \<\/div\>\
			\<\/div\>\
			\<div class=\"one wide column\"\>\
		        \<a\ data-tooltip=\'" + task.playerName + "\'\>\
			        \<img \
			        	src=\"js/avatar_img/" + task.avatarIndex + ".png\" \
			        	alt=\"" + task.avatarIndex + "\"\
			        	id=\"playerAvatar\"\>\
		        \<\/a\>\
		    \<\/div\>\
		\<\/div\>";
	self.message_block = message_block;
	__scroll_to_bottom();
	return self;
}

function ReceivedMessage(task){
	let self = {};
	let message_block = "\
		\<div class=\"ts grid\" onclick=\"showTime()\"\>\
			\<div class=\"one wide column\"\>\
		        \<a\ data-tooltip=\'" + task.playerName + "\'\>\
			        \<img \
			        	src=\"js/avatar_img/" + task.avatarIndex + ".png\" \
			        	alt=\"" + task.avatarIndex + "\"\
			        	id=\"playerAvatar\"\>\
		        \<\/a\>\
		    \<\/div\>\
		    \<div class=\"thirteen wide column\"\>\
			    \<div class=\"ts outlined message\"\
			    	style=\"float: left;\" id=\"msg\"\>\
			    	" + task.msg + "\
			    \<\/div\>\
			\<\/div\>\
			\<div class=\"one wide column\"\>\
		        \<p class=\'time-code\' \
		        	style=\"visibility:hidden; color:gray;\"\>" + 
		        	timecode() + "\<\/P\>\
		    \<\/div\>\
		\<\/div\>";
		self.message_block = message_block;
		__scroll_to_bottom();
	return self;
}

function appendMsg(self){
	$('#chat-container').append(self.message_block);
}

function MsgBlock_Factory(task, func){
	if(func === "transmitted"){
		let self = TransmittedMessage(task);
		appendMsg(self);
	}else{
		let self = ReceivedMessage(task);
		appendMsg(self);
	}
}