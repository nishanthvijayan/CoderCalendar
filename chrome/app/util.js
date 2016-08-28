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

var appCache = {
  store: function(contests){
    now = (new Date()).getTime()/1000;
    localStorage.CACHED_DATA  = JSON.stringify(contests);
    localStorage.CACHED_TIME = now;
  },

  fetch: function(){
    if (this.empty()){
      return { data: {ongoing: [], upcoming: []}, time: 0 };
    }else{
      return {
        data: JSON.parse(localStorage.CACHED_DATA),
        time: localStorage.CACHED_TIME
      };
    }
  },

  dataOlderThan: function(minutes = 5){
    now = (new Date()).getTime()/1000;
    return !!((now-(minutes*60)) > localStorage.CACHED_TIME);
  },

  empty: function(){
    return !(localStorage.CACHED_DATA);
  }
};

module.exports = {
  changeTimezone: changeTimezone,
  appCache: appCache
};
