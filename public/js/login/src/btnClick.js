function btnClick(func){
	var msg = get_playerInfo(func);
	if(!msg.roomTag){
		let tagfield = document.getElementById("tagfield");
		tagfield.setAttribute("class", "error field");
		return false;
	}
	var self = {
		msg:msg,
		func:func
	};
	return submitFunc(self);
}