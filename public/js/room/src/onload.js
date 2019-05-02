var localData = localStorage.getItem('userData');
localData = JSON.parse(localData);

$(document).ready(function(){
	document.getElementById('playerName').innerHTML = "玩家: " + localData.playerName;
	let btn = document.getElementById('roomTag');
	let roomtag = roomTag();
	let Tag = document.createElement('div');
	Tag.setAttribute('id', "tagnumber");
	Tag.innerHTML = "房間流水號: " + roomtag;
	let icon = document.createElement('i');
	icon.setAttribute('class', "clone icon");
	btn.appendChild(Tag);
	btn.appendChild(icon);

	let avatar = document.getElementById('selfAvatar');
	avatar.setAttribute('src', "js/avatar_img/" + localData.playerAvatar + ".png");
	avatar.setAttribute('alt', localData.playerAvatar);
});