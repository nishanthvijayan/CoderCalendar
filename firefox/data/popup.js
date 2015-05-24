// returns the relative path of the icon file
// corresponding to the platform of each post
function icon(platform){

  if(platform=="CODECHEF")          return "img/cc32.jpg";
  else if (platform=="HACKEREARTH") return "img/he32.png";
  else if (platform=="CODEFORCES")  return "img/cf32.png"; 
  else if(platform=="TOPCODER")     return "img/tc32.gif";
  else if(platform=="HACKERRANK")   return "img/hr36.png";
  else if(platform=="GOOGLE")   return "img/google32.png";
  else if(platform=="OTHER")   return "img/other32.png";
}

// converts the input time(which is Indian Standard Time) to
// the browser timezone.
function changeTimezone(date){
  d = new Date(date);
  var offset = -(d.getTimezoneOffset());
  var newDate = new Date(d.getTime() + offset*60000 - 19800000);
  return newDate;
}

// First, the present constest fields are cleared
// Then add contest fields are added by going through the recieved json.
function putdata(json)
{ 
  // removes the previous contest entries.
  $("#upcoming > li").remove();
  $("#ongoing > li").remove();
  $("hr").remove();

  // the conditional statements that compare the start and end time with curTime
  // verifies that each contest gets added to right section regardless of the 
  // section it was present in the "json" variable.
  
  curTime  = new Date();

  $.each(json.result.ongoing , function(i,post){ 
    
    flag=0;
    if(post.Platform=="HACKEREARTH"){
      if(localStorage.getItem(post.Platform+post.challenge_type)=="false")flag=1;
    }
    
    if(localStorage.getItem(post.Platform)=="true" && flag==0){
      endTime   = Date.parse(post.EndTime);
      timezonePerfectEndTime  = changeTimezone(endTime).toString().slice(0,21);
      e = new Date(endTime);
      
      if(e>curTime){
      
        var node = document.createElement("li");
        node.data = post.url;

        linebreak = document.createElement("br");
        var nameText = document.createTextNode(post.Name);
        var nameNode = document.createElement("h4");
        nameNode.appendChild(nameText);
        
        var imageNode = document.createElement("img");
        imageNode.src =  icon(post.Platform);
        
        var endTimeText = document.createTextNode('End: '+timezonePerfectEndTime);
        var endTimeNode = document.createElement("h5");
        endTimeNode.appendChild(endTimeText);

        node.appendChild(document.createElement("br"));
        node.appendChild(nameNode);
        node.appendChild(imageNode);
        node.appendChild(document.createElement("br"));
        node.appendChild(endTimeNode);
        node.appendChild(document.createElement("br"));

        document.getElementById("ongoing").appendChild(node);
        document.getElementById("ongoing").appendChild(document.createElement("hr"));

      }
    }
  });
  
  $.each(json.result.upcoming , function(i,post){ 
    
    flag=0;
    if(post.Platform=="HACKEREARTH"){
      if(localStorage.getItem(post.Platform+post.challenge_type)=="false")flag=1;
    }

    if(localStorage.getItem(post.Platform)=="true" && flag==0){
      // converts the startTime and Endtime revieved
      // to the format required for the Google Calendar link to work
      startTime = Date.parse(post.StartTime)
      timezonePerfectStartTime  = changeTimezone(startTime).toString().slice(0,21);
      endTime   = Date.parse(post.EndTime)
      timezonePerfectEndTime  = changeTimezone(endTime).toString().slice(0,21);

      s = new Date(changeTimezone(startTime).getTime() - ((curTime).getTimezoneOffset()*60000 )).toISOString().slice(0,19).replace(/-/g,"").replace(/:/g,"");
      e = new Date(changeTimezone(endTime).getTime() - ((curTime).getTimezoneOffset()*60000 )).toISOString().slice(0,19).replace(/-/g,"").replace(/:/g,"");
      
      calendarTime = s+'/'+e
      calendarLink = "https://www.google.com/calendar/render?action=TEMPLATE&text="+encodeURIComponent(post.Name)+"&dates="+calendarTime+"&location="+post.url+"&pli=1&uid=&sf=true&output=xml#eventpage_6"
      
      sT = new Date(startTime);
      eT = new Date(endTime);

      if(sT<curTime && eT>curTime){
        var node = document.createElement("li");
        node.data = post.url;

        linebreak = document.createElement("br");
        var nameText = document.createTextNode(post.Name);
        var nameNode = document.createElement("h4");
        nameNode.appendChild(nameText);
        
        var imageNode = document.createElement("img");
        imageNode.src =  icon(post.Platform);
        
        var endTimeText = document.createTextNode('End: '+timezonePerfectEndTime);
        var endTimeNode = document.createElement("h5");
        endTimeNode.appendChild(endTimeText);

        node.appendChild(document.createElement("br"));
        node.appendChild(nameNode);
        node.appendChild(imageNode);
        node.appendChild(document.createElement("br"));
        node.appendChild(endTimeNode);
        node.appendChild(document.createElement("br"));

        document.getElementById("ongoing").appendChild(node);
        document.getElementById("ongoing").appendChild(document.createElement("hr"));

      }
      else if(sT>curTime && eT>curTime){

        var node = document.createElement("li");
        node.data = post.url;

        linebreak = document.createElement("br");
        var nameText = document.createTextNode(post.Name);
        var nameNode = document.createElement("h4");
        nameNode.appendChild(nameText);
        
        var imageNode = document.createElement("img");
        imageNode.src =  icon(post.Platform);
        
        var startTimeText = document.createTextNode('Start: '+timezonePerfectStartTime);
        var startTimeNode = document.createElement("h5");
        startTimeNode.appendChild(startTimeText);

        var durationText  = document.createTextNode('Duration: '+post.Duration);
        var durationNode  = document.createElement("h5");
        durationNode.appendChild(durationText);
        
        var calendarText = document.createTextNode('Add to Calendar');
        var calendarNode  = document.createElement("h5");
        calendarNode.className = "calendar";
        calendarNode.appendChild(calendarText);
        calendarNode.data = calendarLink;
        
        node.appendChild(document.createElement("br"));
        node.appendChild(nameNode);
        node.appendChild(imageNode);
        node.appendChild(document.createElement("br"));
        node.appendChild(startTimeNode);
        node.appendChild(document.createElement("br"));
        node.appendChild(durationNode);
        node.appendChild(document.createElement("br"));
        node.appendChild(calendarNode);

        document.getElementById("upcoming").appendChild(node);
        document.getElementById("upcoming").appendChild(document.createElement("hr"));

      }
    }
  });

}

// sends a request to the backend,on recieving response
// passes the recieved response to putdata()
function fetchdata(){

	imgToggle();
  req =  new XMLHttpRequest();
  req.open("GET",'https://contesttrackerapi.herokuapp.com/',true);
  req.send();
  req.onload = function(){

    $("span").remove();
    $("footer a:nth-child(2)").before('<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<iframe src="https://ghbtns.com/github-btn.html?user=nishanthvijayan&repo=codercalendar&type=star&count=true" frameborder="0" scrolling="0" width="100px" height="20px"></iframe></span>');
    imgToggle();
    
    res = JSON.parse(req.responseText);
    putdata(res);

    // cache creation
    localStorage.cache  = req.responseText;

  };
  req.onerror = function(){
    imgToggle();
    if(localStorage.cache){
      localData = JSON.parse(localStorage.cache);
      putdata(localData);
    }

  };
}

function restoredata(){
  if(localStorage.cache){
    localData = JSON.parse(localStorage.cache);
    putdata(localData);
  }
}

function imgToggle(){
  src = $('.loading').attr('src');
  if(src=="img/refresh-white.png") $(".loading").attr("src","img/ajax-loader.gif");
  else $(".loading").attr("src","img/refresh-white.png");
}

$(document).ready(function(){
  
  //initializing preference values in care they are not set.
  if(!localStorage.HACKEREARTHhiring)localStorage.HACKEREARTHhiring = "true";
  if(!localStorage.HACKEREARTHcontest)localStorage.HACKEREARTHcontest = "true";
  if(!localStorage.HACKERRANK)localStorage.HACKERRANK = "true";
  if(!localStorage.CODECHEF)localStorage.CODECHEF = 'true';
  if(!localStorage.CODEFORCES)localStorage.CODEFORCES = 'true';
  if(!localStorage.TOPCODER)localStorage.TOPCODER = 'true';
  if(!localStorage.GOOGLE)localStorage.GOOGLE = 'true';
  if(!localStorage.OTHER)localStorage.OTHER = 'true';

  fetchdata();

  counter = 0;
  setInterval(function(){
    counter = counter+1;
    timeIntervalMin = parseInt(localStorage.CHECKINTERVAL);
    if(counter%timeIntervalMin==0) fetchdata();
    else{
      if(localStorage.cache){
        localData = JSON.parse(localStorage.cache);
        putdata(localData);
      }else{
        fetchdata();
      }
    }
  }, 60000);

  
  //sends "link to be opened" to main.js
  $("body").on('click',"li", function(){
    self.port.emit("linkClicked",this.data);
    return false;
  });
  
  //sends "link to be opened" to main.js
  $("body").on('click',".calendar", function(){
    self.port.emit("linkClicked",this.data);
    return false;
  });

  //sends "link to be opened" to main.js
  $("body").on('click',"a", function(){
    self.port.emit("linkClicked",$(this).attr('data'));
    return false;
  });

  $("body").on('click',".settings-btn", function(){
    self.port.emit("linkClicked", "options.html" );
  });

  // refresh only if icon is refresh icon.
  // Makes sure that clicking a loading icon does not trigger fetchdata()
  $("body").on('click',".loading", function(){
    src = $('.loading').attr('src');
    if(src=="img/refresh-white.png") fetchdata();
  });

});

