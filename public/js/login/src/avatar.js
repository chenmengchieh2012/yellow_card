var counter = 2;
function changeAvatar(){
	var avatar = document.getElementById("playerAvatar");
	if(counter === 34)
		counter = 1;
	avatar.setAttribute('src', 'js/avatar_img/' + counter + '.png');
	avatar.setAttribute('alt', counter);
	counter += 1;
}