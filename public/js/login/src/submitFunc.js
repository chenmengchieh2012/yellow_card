var submitFunc = function(self){
	var data = {
		playerid: self.msg.playerID,
		roomid: self.msg.roomID,
		playername: self.msg.playerName,
		playeravatar: self.msg.playerAvater
	};

  $.ajax({
    url: "/" + self.func,
    type: 'POST',
    contentType: "application/json",
    data: JSON.stringify({
      event: 'join',
      hashTag: self.msg.roomTag,
      msg: data
    }),
    success: function(result){
     $("body").html(result);
    }
  });
  return true;
}