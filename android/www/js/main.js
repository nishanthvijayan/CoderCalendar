/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */


function icon(platform){

  if(platform=="CODECHEF")          return "cc32.jpg";
  else if (platform=="HACKEREARTH") return "he32.png";
  else if (platform=="CODEFORCES")  return "cf32.png"; 
  else if(platform=="TOPCODER")     return "tc32.gif";
  else if(platform=="HACKERRANK")   return "hr36.png";
}

function putdata(json)
{ 
  
  $("#ongoing > li").remove();
  $("#upcoming > li").remove();
  $("hr").remove();

  $.each(json.result.ongoing , function(i,post){ 
     
    $("#ongoing").append('<li><br><h3  onclick="load(&quot;'+post.url+'&quot;)">'+post.Name+'</h3>\
      <img class="contest_image" src="img/'+icon(post.Platform)+'"></img><br><br>\
      <h4>End: '+post.EndTime+'</h4><br><br>\
      <h4 class="share" onclick="socialShare(0,&quot;'+post.Name+'&quot;,&quot;'+post.url+'&quot;,&quot;'+post.EndTime+'&quot;);" >Tell your Friends</h4>\
      </li><hr>');
  });
  
  $.each(json.result.upcoming , function(i,post){ 
    
    startTime = Date.parse(post.StartTime)
    endTime   = Date.parse(post.EndTime)
    s = new Date(startTime)
    e = new Date(endTime)
    var title = post.Name;
    var eventLocation = post.url;
    var notes = " ";
    var x;
    var success = function(message) {
      if(Object.keys(message).length>0){
        calendar_string = '<h4 onclick="delcalendarEvent(&quot;'+post.Name+'&quot;,&quot;'+post.url+'&quot;,&quot;'+post.StartTime+'&quot;,&quot;'+post.EndTime+'&quot;);" class="calendar">Delete from Calendar</h4>';
      }else{
        calendar_string = '<h4 onclick="addcalendarEvent(&quot;'+post.Name+'&quot;,&quot;'+post.url+'&quot;,&quot;'+post.StartTime+'&quot;,&quot;'+post.EndTime+'&quot;);" class="calendar">Add to Calendar</h4>';
      }
      $("#upcoming").append('<li><br><h3 onclick="load(&quot;'+post.url+'&quot;)">'+post.Name+'</h3>\
        <img class="contest_image" src="img/'+icon(post.Platform)+'"></img><br><br>\
        <h4>Start: '+post.StartTime+'</h4><br>\
        <h4>Duration: '+post.Duration+'</h4><br>'+calendar_string+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\
        <h4 class="share" onclick="socialShare(1,&quot;'+post.Name+'&quot;,&quot;'+post.url+'&quot;,&quot;'+post.StartTime+'&quot;);" >Tell your Friends</h4></li><hr>');
    };

    var error   = function(message) {};

    // seaarch for calendar event
    window.plugins.calendar.findEvent(title,eventLocation,notes,s,e,success,error);
  });

}


function fetchdata(){

  imgToggle();
  req =  new XMLHttpRequest();
  req.open("GET",'https://contesttrackerapi.herokuapp.com/',true);
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
      switch ( index ) {
        case 2:
          window.open(url, "_system");
          break;
        }
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
  var title = name;
  var eventLocation = url;
  var notes = " ";
  var success = function(message) { 
    navigator.notification.alert("'"+name+"'  added to Calendar",function() {},"Notification","OK");
    restoredata();   
  };
  var error = function(message) { };

  // create an event Interactively
  // window.plugins.calendar.createEventInteractively(title,eventLocation,notes,s,e,success,error);
  // create an event silently
  window.plugins.calendar.createEvent(title,eventLocation,notes,s,e,success,error);
  
}

function delcalendarEvent(name,url,StartTime,EndTime){

  startTime = Date.parse(StartTime)
  endTime   = Date.parse(EndTime)
  s = new Date(startTime)
  e = new Date(endTime)
  var title = name;
  var eventLocation = url;
  var notes = " ";
  var success = function(message) { 
    navigator.notification.alert("'"+name+"'  deleted from Calendar",function() {},"Notification","OK");
    restoredata();
  };
  var error = function(message) { };

  window.plugins.calendar.deleteEvent(title,eventLocation,notes,s,e,success,error)
  
}

function socialShare(status,name,url,Time){
  navigator.notification.confirm(
    "Are you sure you want to tell others about this contest? ",
    function( index ) {
      switch ( index ) {
        case 2:
          if(status==1){
            window.plugins.socialsharing.share( 'Hey, Check out this coding contest: \n'+name+' \nLink: '+ url + " \nStarts at: "+Time,'Coding Contest' );
          }else{
            window.plugins.socialsharing.share( 'Hey, Check out this coding contest: \n'+name+' , taking place now at '+ url + " \nEnds at: "+Time,'Coding Contest' );
          }
          break;
      }
    },
    "Confirm", // a title
    [ "No","Yes" ]    // text of the buttons
  );
}

function imgToggle(){
  src = $('.loading').attr('src');
  if(src=="img/refresh-white.png") $(".loading").attr("src","img/ajax-loader.gif");
  else $(".loading").attr("src","img/refresh-white.png");
}

document.addEventListener("deviceready", function(){

  restoredata();

  fetchdata();
  setInterval(function(){
    fetchdata();
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
    navigator.notification.alert("Tap on the contest name to visit the contest page.\n\nTap on Add to Calendar/Delete from Calendar to add/delete the contest to/from your calendar.\n\nTap on 'Tell your Friends' to let others know about the contest.\n\nHappy Coding!",function() {},"Instructions","OK");
  });

});
