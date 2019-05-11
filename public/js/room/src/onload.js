$(document).ready(function(){

	let cookie = getCookie();

	// prepare the player's info and show on to the screen
	document.getElementById('playerName').innerHTML = "玩家: " + cookie.playerName;
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
	avatar.setAttribute('src', "js/avatar_img/" + cookie.playerAvatar + ".png");
	avatar.setAttribute('alt', cookie.playerAvatar);
});