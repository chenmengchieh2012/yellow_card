var copyFunc = function(id, text){
	let txt = document.createElement("textarea");
	txt.value = text;
	document.body.appendChild(txt);
	txt.select();
	document.execCommand('copy');
	setTimeout(function() {
		document.body.removeChild(txt);
	}, 1000);
}