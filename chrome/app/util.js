// converts the input time(which is Indian Standard Time) to
// the browser timezone.
var changeTimezone = function (date){
  d = new Date(date);
  var offset = -(d.getTimezoneOffset());
  var newDate = new Date(d.getTime() + offset*60000 - 19800000);
  return newDate;
}

// returns the relative path of the icon file
// corresponding to the platform of each contest
var icon = function (platform){
  switch (platform){
  case "CODECHEF":
    return "img/cc32.jpg";
  case "HACKEREARTH":
    return "img/he32.png";
  case "CODEFORCES":
    return "img/cf32.png";
  case "TOPCODER":
    return "img/tc32.gif";
  case "HACKERRANK":
    return "img/hr36.png";
  case "GOOGLE":
    return "img/google32.png";
  default:
    return "img/other32.png";
  }
}

var constructGoogleCalendarLink = function(contest){
  var curTime  = new Date();
  var startTime = Date.parse(contest.StartTime);
  var endTime = Date.parse(contest.EndTime);
  var s = new Date(changeTimezone(startTime).getTime() - ((curTime).getTimezoneOffset()*60000 )).toISOString().slice(0,19).replace(/-/g,"").replace(/:/g,"");
  var e = new Date(changeTimezone(endTime).getTime() - ((curTime).getTimezoneOffset()*60000 )).toISOString().slice(0,19).replace(/-/g,"").replace(/:/g,"");    
  var calendarTime = s+'/'+e
  return "https://www.google.com/calendar/render?action=TEMPLATE&text="+encodeURIComponent(contest.Name)+
               "&dates="+calendarTime+"&location="+contest.url+"&pli=1&uid=&sf=true&output=xml#eventpage_6";
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

//initializing preference values in care they are not set.
var initializeLocalStorage = function(){
  supportedPlatforms = ['HACKEREARTH', 'HACKERRANK', 'CODECHEF', 'CODEFORCES', 'TOPCODER', 'GOOGLE', 'OTHER'];
  $.each(supportedPlatforms,function(i, platform){
    if(!localStorage.getItem(platform)) localStorage.setItem(platform,'true');
  });
}

var filterContestsBySettings = function(contests){
  filteredContests = contests.filter(function(contest){
    return !!(localStorage.getItem(contest.Platform));
  });
  return filteredContests;
};

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
  icon: icon,
  changeTimezone: changeTimezone,
  constructGoogleCalendarLink: constructGoogleCalendarLink,
  changeTimezone: changeTimezone,
  initializeLocalStorage: initializeLocalStorage,
  filterContestsBySettings: filterContestsBySettings,
  appCache: appCache
};
