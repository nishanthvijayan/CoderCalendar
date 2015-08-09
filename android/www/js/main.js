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

      ongoingHTML+='<li><div class="contest-wrapper"><br><h3 >'+post.Name+'</h3>\
        <img class="contest_image" src="img/'+icon(post.Platform)+'"></img><br><br>\
        <h4>End: '+timezonePerfectEndTime+'</h4></div><hr><br>\
        <div class="contest-action">\
        <i class="fa fa-link card-icon grey-text" onclick="load(&quot;'+post.url+'&quot;)" ></i>\
        <i class="fa fa-share-alt card-icon grey-text" onclick="socialShare(0,&quot;'+post.Name+'&quot;,&quot;'+post.url+'&quot;,&quot;'+timezonePerfectEndTime+'&quot;);" ></i>\
        </div></li>';
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
        calendar_string = '<i id="calButton'+i+'" class="red-text fa fa-trash card-icon" onclick="decideCalendarEvent('+i+',&quot;'+post.Name+'&quot;,&quot;'+post.url+'&quot;,&quot;'+timezonePerfectStartTime+'&quot;,&quot;'+timezonePerfectEndTime+'&quot;);"></i>';
      }else{
        calendar_string = '<i id="calButton'+i+'" class="green-text fa fa-calendar card-icon" onclick="decideCalendarEvent('+i+',&quot;'+post.Name+'&quot;,&quot;'+post.url+'&quot;,&quot;'+timezonePerfectStartTime+'&quot;,&quot;'+timezonePerfectEndTime+'&quot;);"></i>';
      }

      upcomingHTML+='<li><div class="contest-wrapper"><br><h3>'+post.Name+'</h3>\
      <img class="contest_image" src="img/'+icon(post.Platform)+'"></img><br><br>\
      <h4>Start: '+timezonePerfectStartTime+'</h4><br>\
      <h4>Duration: '+post.Duration+'</h4></div>\
      <hr><br><div class="contest-action">'+calendar_string+
      '<i class="fa fa-link card-icon grey-text " onclick="load(&quot;'+post.url+'&quot;)" ></i>\
      <i class="fa fa-share-alt card-icon grey-text" onclick="socialShare(1,&quot;'+post.Name+'&quot;,&quot;'+post.url+'&quot;,&quot;'+timezonePerfectStartTime+'&quot;);" ></i>\
      </div></li>';
    };

    var error   = function(message) {};

    // if contest has not ended    
    if(e>curTime && s>curTime && localStorage.getItem(post.Platform)=="true" ){
      // seaarch for calendar event
      window.plugins.calendar.findEvent(post.Name,post.url," ",s,e,success,error);
    }else if(e>curTime && s<curTime && localStorage.getItem(post.Platform)=="true" ){

      timezonePerfectEndTime  = changeTimezone(Date.parse(post.EndTime)).toString().slice(0,21);
      timezonePerfectStartTime  = changeTimezone(Date.parse(post.StartTime)).toString().slice(0,21);

      ongoingHTML+='<li><div class="contest-wrapper"><br><h3 >'+post.Name+'</h3>\
        <img class="contest_image" src="img/'+icon(post.Platform)+'"></img><br><br>\
        <h4>End: '+timezonePerfectEndTime+'</h4></div><hr><br>\
        <div class="contest-action">\
        <i class="fa fa-link card-icon grey-text" onclick="load(&quot;'+post.url+'&quot;)" ></i>\
        <i class="fa fa-share-alt card-icon grey-text" onclick="socialShare(0,&quot;'+post.Name+'&quot;,&quot;'+post.url+'&quot;,&quot;'+timezonePerfectEndTime+'&quot;);" ></i>\
        </div></li>';
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

  $( ".btn-floating" ).toggleClass( "fa-spin" );
  req =  new XMLHttpRequest();
  req.open("GET",'https://contesttrackerapi.herokuapp.com/android/',true);
  req.send();
  req.onload = function(){


    res = JSON.parse(req.responseText);

    data = JSON.stringify(res);
    window.localStorage.setItem('last_collected_data', data);
    
    $( ".btn-floating" ).toggleClass( "fa-spin" );
    putdata(res);
  };
  req.onerror = function(){
    $( ".btn-floating" ).toggleClass( "fa-spin" );
    restoredata();
    window.plugins.toast.show("No Connection", 'long', 'bottom', function(a){}, function(b){});
  };
}

function restoredata(){
  if(window.localStorage.getItem('last_collected_data')){
    var localData = JSON.parse(window.localStorage.getItem('last_collected_data'));
    putdata(localData);
  }
}

function load(url){
  window.analytics.trackEvent('LoadPage', 'Click');
  navigator.notification.confirm(
    "Go to contest page?",
    function( index ) {
      if ( index==2 )   window.open(url, "_system");
    },
    "Confirm", // a title
    [ "No","Yes" ]    // text of the buttons
  );
}

function decideCalendarEvent(id,name,url,StartTime,EndTime){
  if($("#calButton"+id).hasClass("fa-trash")){
    delcalendarEvent(id,name,url,StartTime,EndTime);
  }else{
    addcalendarEvent(id,name,url,StartTime,EndTime);
  }
}

function addcalendarEvent(id,name,url,StartTime,EndTime){

  startTime = Date.parse(StartTime)
  endTime   = Date.parse(EndTime)
  s = new Date(startTime)
  e = new Date(endTime)

  var success = function(message) { 
    // Okay.So let me explain.Some calendar apps don't support silent event creation,
    // So everytime an event is to be added after trying silent creation,it searches whether
    // the event has been actually added.If yes,hurray.Else,interactiveCreate is called().
    // In that case the corresponding icon change is managed by calling restoredata()
    // under document.addEventListener("resume")

    window.plugins.calendar.findEvent(name,url," ",s,e,function(message){
      if(Object.keys(message).length>0){
        window.analytics.trackEvent('Calendar', 'Click',"AddSilent");
        $("#calButton"+id).addClass('fa-trash').addClass("red-text").removeClass('fa-calendar').removeClass('green-text');
        window.plugins.toast.show("'"+name+"'  added to Calendar", 'short', 'bottom', function(a){}, function(b){});
      }else{
        window.plugins.calendar.createEventInteractively(name,url," ",s,e,function(n){
          window.analytics.trackEvent('Calendar', 'Click',"AddInteractive");
        }, function(m){} );
      }
    },function(b){});
    
  };

  // create an event silently
  window.plugins.calendar.createEvent(name,url," ",s,e,success, function(m){} );
  
}

function delcalendarEvent(id,name,url,StartTime,EndTime){
  
  window.analytics.trackEvent('Calendar', 'Click', 'Delete');
  
  startTime = Date.parse(StartTime)
  endTime   = Date.parse(EndTime)
  s = new Date(startTime)
  e = new Date(endTime)

  var success = function(message) { 
    $("#calButton"+id).removeClass('fa-trash').removeClass("red-text").addClass('fa-calendar').addClass('green-text');
    window.plugins.toast.show("'"+name+"'  deleted from Calendar", 'short', 'bottom', function(a){}, function(b){});
  };

  window.plugins.calendar.deleteEvent(name,url," ",s,e,success, function(m){} );
  
}

function socialShare(status,name,url,Time){
  window.analytics.trackEvent('Share', 'Click');
  if(status==1){
    window.plugins.socialsharing.share( 'Hey, Check out this coding contest: \n'+name+' \nLink: '+ url + " \nStarts at: "+Time,'Coding Contest' );
  }else{
    window.plugins.socialsharing.share( 'Hey, Check out this coding contest: \n'+name+' , taking place now at '+ url + " \nEnds at: "+Time,'Coding Contest' );
  }
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
}

document.addEventListener("deviceready", function(){

  FastClick.attach(document.body);
  
  window.analytics.startTrackerWithId('UA-64496539-1');
  window.analytics.trackView('Home');

  initializeSetting();

  restoredata();
  fetchdata();
  
  counter = 0;
  setInterval(function(){
    counter = counter+1;
    if(counter%5==0) fetchdata();
    else restoredata();
  }, 120000);

  // refresh only if icon is refresh icon and not spinning already.
  $(".btn-floating").click(function(){
    if(!$( ".btn-floating" ).hasClass( "fa-spin" )) fetchdata();
  });

  $(".info-btn").click(function(){
    window.analytics.trackEvent('Info', 'Click');
    navigator.notification.alert("Select the link icon to visit the contest page.\n\nTap on calendar/trash icon to add/delete a contest to/from your calendar.\n\nTap on the share icon to share the details of a contest.\n\nHappy Coding!",function() {},"Instructions","OK");
  });

  $(".rate-btn").click(function(){
    navigator.notification.confirm("Rate Coder's Calendar?",
      function( index ) {
            if(index==2) {
              window.analytics.trackEvent('Rate', 'Click');
              window.open("https://bit.ly/1KqFi3U", "_system");
            }
        },
        "Rate Us",
        [ "Later","Yes" ]
      );
  });

  $(".share-btn").click(function(){
    window.analytics.trackEvent('ShareApp', 'Click');
    window.plugins.socialsharing.share( "Check out this app: Coder's Calendar , https://play.google.com/store/apps/details?id=com.corphots.coderscalendar " );
  });

});

document.addEventListener("resume",function(){
  restoredata();
})