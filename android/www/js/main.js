function icon(platform){

  if(platform=="CODECHEF")          return "cc32.jpg";
  else if (platform=="HACKEREARTH") return "he32.png";
  else if (platform=="CODEFORCES")  return "cf32.png"; 
  else if(platform=="TOPCODER")     return "tc32.gif";
  else if(platform=="HACKERRANK")   return "hr36.png";
  else if(platform=="GOOGLE")   	return "google32.png";
  else   		return "other32.png";
}

function changeTimezone(date){
  d = new Date(date);
  var offset = -(d.getTimezoneOffset());
  var newDate = new Date(d.getTime() + offset*60000 - 19800000);
  return newDate;
}

function putdata(json)
{ 

  // the conditional statements that compare the start and end time with curTime
  // verifies makes sure that each contest gets added to right section regardless of the 
  // section it was present in the "json" variable.

  curTime  = new Date();
  ongoingHTML = "";
  upcomingHTML = "";
  
  $.each(json.result.ongoing , function(i,post){

    endTime   = Date.parse(post.EndTime)
    e = new Date(endTime)
    
    if(e>curTime && localStorage.getItem(post.Platform)=="true" ){

      timezonePerfectEndTime  = changeTimezone(Date.parse(post.EndTime)).toString().slice(0,21);
      timezonePerfectStartTime  = changeTimezone(Date.parse(post.StartTime)).toString().slice(0,21);

      ongoingHTML+='<li><br><h3  onclick="load(&quot;'+post.url+'&quot;)">'+post.Name+'</h3>\
        <img class="contest_image" src="img/'+icon(post.Platform)+'"></img><br><br>\
        <h4>End: '+timezonePerfectEndTime+'</h4><br><br>\
        <h4 class="share" onclick="socialShare(0,&quot;'+post.Name+'&quot;,&quot;'+post.url+'&quot;,&quot;'+timezonePerfectEndTime+'&quot;);" >Share</h4>\
        </li><hr>';
    }

  });
  
  $.each(json.result.upcoming , function(i,post){ 
    
    startTime = Date.parse(post.StartTime)
    endTime   = Date.parse(post.EndTime)
    s = new Date(startTime)
    e = new Date(endTime)
    var title = post.Name;
    var eventLocation = post.url;
    var notes = " ";
    var success = function(message) {
      
      timezonePerfectEndTime  = changeTimezone(Date.parse(post.EndTime)).toString().slice(0,21);
      timezonePerfectStartTime  = changeTimezone(Date.parse(post.StartTime)).toString().slice(0,21);

      if(Object.keys(message).length>0){
        calendar_string = '<h4 class="calDelete" onclick="delcalendarEvent(&quot;'+post.Name+'&quot;,&quot;'+post.url+'&quot;,&quot;'+timezonePerfectStartTime+'&quot;,&quot;'+timezonePerfectEndTime+'&quot;);" class="calendar">Delete from Calendar</h4>';
      }else{
        calendar_string = '<h4 class="calAdd" onclick="addcalendarEvent(&quot;'+post.Name+'&quot;,&quot;'+post.url+'&quot;,&quot;'+timezonePerfectStartTime+'&quot;,&quot;'+timezonePerfectEndTime+'&quot;);" class="calendar">Add to Calendar</h4>';
      }

      upcomingHTML+='<li><br><h3 onclick="load(&quot;'+post.url+'&quot;)">'+post.Name+'</h3>\
      <img class="contest_image" src="img/'+icon(post.Platform)+'"></img><br><br>\
      <h4>Start: '+timezonePerfectStartTime+'</h4><br>\
      <h4>Duration: '+post.Duration+'</h4><br>'+calendar_string+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\
      <h4 class="share" onclick="socialShare(1,&quot;'+post.Name+'&quot;,&quot;'+post.url+'&quot;,&quot;'+timezonePerfectStartTime+'&quot;);" >Share</h4></li><hr>';
    };

    var error   = function(message) {};

    // if contest has not ended    
    if(e>curTime && s>curTime && localStorage.getItem(post.Platform)=="true" ){
      // seaarch for calendar event
      window.plugins.calendar.findEvent(title,eventLocation,notes,s,e,success,error);
    }else if(e>curTime && s<curTime && localStorage.getItem(post.Platform)=="true" ){

      timezonePerfectEndTime  = changeTimezone(Date.parse(post.EndTime)).toString().slice(0,21);
      timezonePerfectStartTime  = changeTimezone(Date.parse(post.StartTime)).toString().slice(0,21);

      ongoingHTML+='<li><br><h3  onclick="load(&quot;'+post.url+'&quot;)">'+post.Name+'</h3>\
        <img class="contest_image" src="img/'+icon(post.Platform)+'"></img><br><br>\
        <h4>End: '+timezonePerfectEndTime+'</h4><br><br>\
        <h4 class="share" onclick="socialShare(0,&quot;'+post.Name+'&quot;,&quot;'+post.url+'&quot;,&quot;'+timezonePerfectEndTime+'&quot;);" >Share</h4>\
        </li><hr>';
    }

  });
  // A better fix,the timeout is to wait for the callback to complete.
  setTimeout(function(){
      $("#ongoing > li").remove();
      $("#upcoming > li").remove();
      $("hr").remove();
      $(".ui-content").show();
      $("footer").show();
    document.getElementById("ongoing").innerHTML += ongoingHTML;
    document.getElementById("upcoming").innerHTML += upcomingHTML;
  },500);

}


function fetchdata(){

  imgToggle();
  req =  new XMLHttpRequest();
  req.open("GET",'https://contesttrackerapi.herokuapp.com/android/',true);
  req.send();
  req.onload = function(){


    res = JSON.parse(req.responseText);

    data = JSON.stringify(res);
    window.localStorage.setItem('last_collected_data', data);
    
    imgToggle();
    putdata(res);
  };
  req.onerror = function(){
    imgToggle();
    restoredata();
    navigator.notification.alert("Connection Failed",function() {},"Error","OK");
  };
}

function restoredata(){
  if(window.localStorage.getItem('last_collected_data')){
    var localData = JSON.parse(window.localStorage.getItem('last_collected_data'));
    putdata(localData);
  }
}

function load(url){
  navigator.notification.confirm(
    "Would you like to open the contest page?",
    function( index ) {
      if ( index==2 )   window.open(url, "_system");
    },
    "Confirm", // a title
    [ "No","Yes" ]    // text of the buttons
  );
}

function addcalendarEvent(name,url,StartTime,EndTime){

  startTime = Date.parse(StartTime)
  endTime   = Date.parse(EndTime)
  s = new Date(startTime)
  e = new Date(endTime)

  var success = function(message) { 
    restoredata();
    window.plugins.toast.show("'"+name+"'  added to Calendar", 'long', 'bottom', function(a){}, function(b){});   
  };

  // create an event silently
  window.plugins.calendar.createEvent(name,url," ",s,e,success, function(m){} );
  
}

function delcalendarEvent(name,url,StartTime,EndTime){

  startTime = Date.parse(StartTime)
  endTime   = Date.parse(EndTime)
  s = new Date(startTime)
  e = new Date(endTime)

  var success = function(message) { 
    restoredata();
    window.plugins.toast.show("'"+name+"'  deleted from Calendar", 'long', 'bottom', function(a){}, function(b){});
  };

  window.plugins.calendar.deleteEvent(name,url," ",s,e,success, function(m){} );
  
}

function socialShare(status,name,url,Time){
  navigator.notification.confirm(
    "Are you sure you want to tell others about this contest? ",
    function( index ) {
      if ( index==2 ) {
        if(status==1){
          window.plugins.socialsharing.share( 'Hey, Check out this coding contest: \n'+name+' \nLink: '+ url + " \nStarts at: "+Time,'Coding Contest' );
        }else{
          window.plugins.socialsharing.share( 'Hey, Check out this coding contest: \n'+name+' , taking place now at '+ url + " \nEnds at: "+Time,'Coding Contest' );
        }
      }
    },
    "Confirm",
    [ "No","Yes" ]
  );
}

// Toggles between the loading gif and the reload icon.
function imgToggle(){
  src = $('.loading').attr('src');
  if(src=="img/refresh-white.png") $(".loading").attr("src","img/ajax-loader.gif");
  else $(".loading").attr("src","img/refresh-white.png");
}

function initializeSetting(){
  
  //initializing preference values in case they are not set.
  if(!localStorage.HACKEREARTH)localStorage.HACKEREARTH = "true";
  if(!localStorage.HACKERRANK)localStorage.HACKERRANK = "true";
  if(!localStorage.CODECHEF)localStorage.CODECHEF = 'true';
  if(!localStorage.CODEFORCES)localStorage.CODEFORCES = 'true';
  if(!localStorage.TOPCODER)localStorage.TOPCODER = 'true';
  if(!localStorage.GOOGLE)localStorage.GOOGLE = 'true';
  if(!localStorage.OTHER)localStorage.OTHER = 'true';
  if(!localStorage.CHECKINTERVAL)localStorage.CHECKINTERVAL = 5;
}

document.addEventListener("deviceready", function(){

  FastClick.attach(document.body);
  
  initializeSetting();

  fetchdata();
  // this mechanism makes sure that the data is fetched every 
  // 30 minutes and the validy of entries is checked every 5 minutes.(Overkill?)
  counter = 0;
  setInterval(function(){
    counter = counter+1;
    timeIntervalMin = parseInt(localStorage.CHECKINTERVAL);
    if(counter%timeIntervalMin==0) fetchdata();
    else restoredata();
  }, 300000);

  // refresh only if icon is refresh icon.
  // Makes sure that clicking a loading icon does not trigger fetchdata()
  $(".loading").click(function(){
    src = $('.loading').attr('src');
    if(src=="img/refresh-white.png") fetchdata();
    
    // the loading gif get stucks sometimes and starts spinning again only when the 
    // user scrolls or selects some item.This works around this by scrolling down & up by 1px.
    window.scrollBy(0,1);
    window.scrollBy(0,-1);
  });

  $(".info").click(function(){
    navigator.notification.alert("Tap on the contest name to visit the contest page.\n\nTap on Add to Calendar/Delete from Calendar to add/delete the contest to/from your calendar.\n\nTap on 'Share' to let others know about the contest.\n\nHappy Coding!",function() {},"Instructions","OK");
  });

  $(".share-btn").click(function(){
    window.plugins.socialsharing.share( "Check out this app: Coder's Calendar , https://play.google.com/store/apps/details?id=com.corphots.coderscalendar " );
  });

});
