var buttons = require('sdk/ui/button/action');
var panels = require("sdk/panel");
var self = require("sdk/self");
var tabs = require("sdk/tabs");
var preferences = require("sdk/simple-prefs");


var newsfeed = panels.Panel({
  width: 350,
  height: 500,
  contentURL: self.data.url("popup.html"),
  contentScriptFile: [self.data.url("jquery.js"),self.data.url("popup.js")]
});


var button = buttons.ActionButton({
  id: "CoderCalendar",
  label: "Displays upcoming and ongoing coding contests from various platforms",
  icon: {
    "16": "./img/icon32.png",
    "32": "./img/icon32.png"
  },
  onClick: popup 
})


function popup(){
  newsfeed.show({ position: button });
 };


newsfeed.port.on("linkClicked", function (text) {
  //open new tab with link
  tabs.open(text);
});


preferences.on("Hackerearth", function(){
  newsfeed.port.emit("Hackerearth_Changed",preferences.prefs['Hackerearth'] );
});

preferences.on("Hackerrank", function(){
  newsfeed.port.emit("Hackerrank_Changed",preferences.prefs['Hackerrank'] );
});

preferences.on("Codechef", function(){
  newsfeed.port.emit("Codechef_Changed",preferences.prefs['Codechef'] );
});

preferences.on("Codeforces", function(){
  newsfeed.port.emit("Codeforces_Changed",preferences.prefs['Codeforces'] );
});

preferences.on("Topcoder", function(){
  newsfeed.port.emit("Topcoder_Changed",preferences.prefs['Topcoder'] );
});
