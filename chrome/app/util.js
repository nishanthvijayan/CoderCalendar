// converts the input time(which is Indian Standard Time) to
// the browser timezone.
var changeTimezone = function (date){
  d = new Date(date);
  var offset = -(d.getTimezoneOffset());
  var newDate = new Date(d.getTime() + offset*60000 - 19800000);
  return newDate;
}

// var getVersion = function () {
//   var details = chrome.app.getDetails();
//   return details.version;
// }

// var checkRuntime = function (){
  
//   // Check if the version has changed.
//   var currVersion = getVersion();
//   var prevVersion = localStorage['version']
//   if (currVersion != prevVersion) {
//     // Check if we just installed this extension.
//     if (typeof prevVersion == 'undefined') {
//       chrome.tabs.create({ url: "options.html" });
//     } else {
//       chrome.tabs.create({ url: "options.html" });
//     }
//     localStorage['version'] = currVersion;
//   }
// }

module.exports = {
  changeTimezone: changeTimezone
};
