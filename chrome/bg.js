 setInterval(function(){
 	var req =  new XMLHttpRequest();
	req.open("GET","http://contesttrackerapi.herokuapp.com/notification_count",true);
	req.send();
	req.onload = function(){
	chrome.browserAction.setBadgeText({text: req.responseText}); // We have 10+ unread items.
	chrome.browserAction.setBadgeBackgroundColor({ color: "#4c9bff"});
	};
 }, 15000);