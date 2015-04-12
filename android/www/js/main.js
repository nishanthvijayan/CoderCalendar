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
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        
    }
};

app.initialize();



function icon(platform){

  if(platform=="CODECHEF"){
      return "cc32.jpg";
  }else if (platform=="HACKEREARTH") {
      return "he32.png";
  }else if (platform=="CODEFORCES") {
      return "cf32.png";
  }
  else if(platform=="TOPCODER"){
      return "tc32.gif";
  }
  else if(platform=="HACKERRANK"){
      return "hr36.png";
  }
}

function putdata(json)
{ 
  
  $.each(json.result.ongoing , function(i,post){ 
     
     $("#ongoing").append('<li><br><h3>'+post.Name+'</h3>\
        <img class="contest_image" src="img/'+icon(post.Platform)+'"></img><br>\
        <h5>End: '+post.EndTime+'</h5><br>\
        </li>');
    });
  
  $.each(json.result.upcoming , function(i,post){ 

      $("#upcoming").append('<li><br><h3>'+post.Name+'</h3>\
        <img class="contest_image" src="img/'+icon(post.Platform)+'"></img><br>\
        <h5>Start: '+post.StartTime+'</h5><br>\
        <h5>Duration: '+post.Duration+'</h5><br>\
        <h5  class="calender">Add to Calendar</h5>\
        </li>');
    });

}


function fetchdata(){

    req =  new XMLHttpRequest();
    req.open("GET",'https://contesttrackerapi.herokuapp.com/',true);
    req.send();
    req.onload = function(){
        $("#ongoing > a").remove();
        $("#upcoming > a").remove();
        res = JSON.parse(req.responseText);

        data = JSON.stringify(res);
        window.localStorage.setItem('last_collected_data', data);
        
        putdata(res);
    };
}


$(document).ready(function(){
  
  if(window.localStorage.getItem('last_collected_data')){
      var localData = JSON.parse(window.localStorage.getItem('last_collected_data'));
      putdata(localData);
  }

  setInterval(function(){
    fetchdata();
  }, 300000)


});
