var buttons = require('sdk/ui/button/action');
var panels = require("sdk/panel");
var self = require("sdk/self");
var tabs = require("sdk/tabs");


var newsfeed = panels.Panel({
  width: 350,
  height: 500,
  contentURL: self.data.url("popup.html"),
  contentScriptFile: [self.data.url("jquery.js"),self.data.url("popup.js"),self.data.url("moment.js")]
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

exports.main = function (options, callbacks) {
    if (options.loadReason === 'install' || options.loadReason === 'upgrade') {
        tabs.open("http://nishanthvijayan.github.io/CoderCalendar/");
    }
};

newsfeed.port.on("linkClicked", function (text) {
  //open new tab with link
  tabs.open(text);
});
