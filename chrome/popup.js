
var ongoingHtmlString = "";
var upcomingHtmlString = "";
var now;

function icon(platform){

  if(platform=="CODECHEF"){
      return "img/cc32.jpg";
  }else if (platform=="HACKEREARTH") {
      return "img/he32.png";
  }else if (platform=="CODEFORCES") {
      return "img/cf32.png";
  }
  else if(platform=="TOPCODER"){
      return "img/tc32.gif";
  }
  else if(platform=="HACKERRANK"){
      return "img/hr36.png";
  }
}

function putdata(json)
{ 
  ongoingHtmlString= "";
  upcomingHtmlString = "";

  $.each(json.result.ongoing , function(i,post){ 
     
   ongoingHtmlString +='<a  data='+'"'+post.url+'"'+'>\
    <li><br><h3>'+post.Name+'</h3>\
    <img src="'+icon(post.Platform)+'"></img><br>\
    <h4>End: '+post.EndTime+'</h4><br>\
    </li><hr></a>';
  });
  
  $("#ongoing").append(ongoingHtmlString);

  $.each(json.result.upcoming , function(i,post){ 

    startTime = Date.parse(post.StartTime)
    endTime   = Date.parse(post.EndTime)
    s = new Date(startTime+19800000).toISOString().slice(0,19).replace(/-/g,"").replace(/:/g,"")
    e = new Date(endTime+19800000).toISOString().slice(0,19).replace(/-/g,"").replace(/:/g,"")
    
    calenderTime = s+'/'+e
    calenderLink = "https://www.google.com/calendar/render?action=TEMPLATE&text="+encodeURIComponent(post.Name)+"&dates="+calenderTime+"&location="+post.url+"&pli=1&uid=&sf=true&output=xml#eventpage_6"
    
    upcomingHtmlString+= '<a  data='+'"'+post.url+'"'+'>\
      <li><br><h3>'+post.Name+'</h3>\
      <img src="'+icon(post.Platform)+'"></img><br>\
      <h4>Start: '+post.StartTime+'</h4><br>\
      <h4>Duration: '+post.Duration+'</h4><br>\
      <h4 data='+calenderLink+' class="calender">Add to Calendar</h4>\
      </li><hr></a>';
  });

  $("#upcoming").append(upcomingHtmlString);



}


function fetchdata(){

    $("#imgAjaxLoader").show();
    req =  new XMLHttpRequest();
    req.open("GET",'https://contesttrackerapi.herokuapp.com/',true);
    req.send();
    req.onload = function(){
        res = JSON.parse(req.responseText);
        $("#imgAjaxLoader").hide();
        putdata(res);

        // cache creation
        localStorage.cacheUpcoming  = upcomingHtmlString;
        localStorage.cacheOngoing  = ongoingHtmlString;
        localStorage.time = now;
        
    };
}



$(document).ready(function(){

  now = (new Date()).getTime()/1000;
  if(!localStorage.cacheUpcoming || now - parseInt(localStorage.time) > 5*60){
    // cache is old or not set
    fetchdata();
  
  }
  else{
    // cache is fresh
    $("#upcoming").append(localStorage.cacheUpcoming);
    $("#ongoing").append(localStorage.cacheOngoing);
    if(localStorage.scrollTop){
        document.body.scrollTop = localStorage.scrollTop;
    }

  }

  setInterval(function(){  fetchdata(); }, 300000)

  addEventListener('scroll', function(){
    localStorage.scrollTop = document.body.scrollTop;
  });

  $("body").on('click',"a", function(){
       chrome.tabs.create({url: $(this).attr('data')});
       return false;
     });
  $("body").on('click',".calender", function(){
       chrome.tabs.create({url: $(this).attr('data')});
       return false;
     });

});

