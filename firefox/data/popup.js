// returns the relative path of the icon file
// corresponding to the platform of each post
function icon(platform){

  if(platform=="CODECHEF")          return "img/cc32.jpg";
  else if (platform=="HACKEREARTH") return "img/he32.png";
  else if (platform=="CODEFORCES")  return "img/cf32.png"; 
  else if(platform=="TOPCODER")     return "img/tc32.gif";
  else if(platform=="HACKERRANK")   return "img/hr36.png";
}

// First, the present constest fields are cleared
// Then add contest fields are added by going through the recieved json
function putdata(json)
{ 
  $("#upcoming > a").remove();
  $("#ongoing > a").remove();
  $("hr").remove();
  
  $.each(json.result.ongoing , function(i,post){ 
     
    $("#ongoing").append('<a  data='+'"'+post.url+'"'+'>\
    	<li><br><h4>'+post.Name+'</h4>\
    	<img src="'+icon(post.Platform)+'"></img><br>\
    	<h5>End: '+post.EndTime+'</h5><br>\
    	</li><hr></a>');
  });
  
  $.each(json.result.upcoming , function(i,post){ 

    // converts the startTime and Endtime revieved
    // to the format required for the Google Calender link to work
    startTime = Date.parse(post.StartTime)
    endTime   = Date.parse(post.EndTime)
    s = new Date(startTime+19800000).toISOString().slice(0,19).replace(/-/g,"").replace(/:/g,"")
    e = new Date(endTime+19800000).toISOString().slice(0,19).replace(/-/g,"").replace(/:/g,"")
    
    calendarTime = s+'/'+e
    calendarLink = "https://www.google.com/calendar/render?action=TEMPLATE&text="+encodeURIComponent(post.Name)+"&dates="+calendarTime+"&location="+post.url+"&pli=1&uid=&sf=true&output=xml#eventpage_6"
    
    $("#upcoming").append('<a  data='+'"'+post.url+'"'+'>\
    	<li><br><h4>'+post.Name+'</h4>\
    	<img src="'+icon(post.Platform)+'"></img><br>\
    	<h5>Start: '+post.StartTime+'</h5><br>\
    	<h5>Duration: '+post.Duration+'</h5><br>\
    	<h5 data='+calendarLink+' class="calendar">Add to Calendar</h5>\
    	</li><hr></a>');
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
      
    imgToggle();
    res = JSON.parse(req.responseText);
    putdata(res);
  };
  req.onerror = function(){
    imgToggle();
  };
}

function imgToggle(){
  src = $('.loading').attr('src');
  if(src=="img/refresh-white.png") $(".loading").attr("src","img/ajax-loader.gif");
  else $(".loading").attr("src","img/refresh-white.png");
}

$(document).ready(function(){
  fetchdata();
  setInterval(function(){ fetchdata() }, 300000)


  //sends "link to be opened" to main.js
  $("body").on('click',"a", function(){
    self.port.emit("postClicked",$(this).attr('data'));
    return false;
  });
  
  //sends "link to be opened" to main.js
  $("body").on('click',".calendar", function(){
    self.port.emit("postClicked",$(this).attr('data'));
    return false;
  });

  // refresh only if icon is refresh icon.
  // Makes sure that clicking a loading icon does not trigger fetchdata()
  $("body").on('click',".loading", function(){
    src = $('.loading').attr('src');
    if(src=="img/refresh-white.png") fetchdata();
  });
});

