// returns the relative path of the icon file
// corresponding to the platform of each post
function icon(platform){

  if(platform=="CODECHEF")          return "img/cc32.jpg";
  else if (platform=="HACKEREARTH") return "img/he32.png";
  else if (platform=="CODEFORCES")  return "img/cf32.png"; 
  else if(platform=="TOPCODER")     return "img/tc32.gif";
  else if(platform=="HACKERRANK")   return "img/hr36.png";
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
  $("#upcoming > a").remove();
  $("#ongoing > a").remove();
  $("hr").remove();

  // the conditional statements that compare the start and end time with curTime
  // verifies that each contest gets added to right section regardless of the 
  // section it was present in the "json" variable.
  
  curTime  = new Date();

  $.each(json.result.ongoing , function(i,post){ 
    
    endTime   = Date.parse(post.EndTime);
    timezonePerfectEndTime  = changeTimezone(endTime).toString().slice(0,21);
    e = new Date(endTime);
    
    if(e>curTime){
    
      $("#ongoing").append('<a  data='+'"'+post.url+'"'+'>\
      	<li><br><h4>'+post.Name+'</h4>\
      	<img title="'+post.Platform+'" src="'+icon(post.Platform)+'"></img><br>\
      	<h5>End: '+timezonePerfectEndTime+'</h5><br>\
      	</li><hr></a>');
    }
  });
  
  $.each(json.result.upcoming , function(i,post){ 

    // converts the startTime and Endtime revieved
    // to the format required for the Google Calender link to work
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
      $("#ongoing").append('<a  data='+'"'+post.url+'"'+'>\
        <li><br><h4>'+post.Name+'</h4>\
        <img title="'+post.Platform+'" src="'+icon(post.Platform)+'"></img><br>\
        <h5>End: '+timezonePerfectEndTime+'</h5><br>\
        </li><hr></a>');
    }
    else if(sT>curTime && eT>curTime){
      $("#upcoming").append('<a  data='+'"'+post.url+'"'+'>\
        <li><br><h4>'+post.Name+'</h4>\
        <img title="'+post.Platform+'" src="'+icon(post.Platform)+'"></img><br>\
        <h5>Start: '+timezonePerfectStartTime+'</h5><br>\
        <h5>Duration: '+post.Duration+'</h5><br>\
        <h5 data='+calendarLink+' class="calendar">Add to Calendar</h5>\
        </li><hr></a>');
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

function imgToggle(){
  src = $('.loading').attr('src');
  if(src=="img/refresh-white.png") $(".loading").attr("src","img/ajax-loader.gif");
  else $(".loading").attr("src","img/refresh-white.png");
}

$(document).ready(function(){

  fetchdata();

  counter = 0;
  setInterval(function(){
    counter = counter+1;
    if(counter%6==0) fetchdata();
    else{
      if(localStorage.cache){
        localData = JSON.parse(localStorage.cache);
        putdata(localData);
      }else{
        fetchdata();
      }
    }
  }, 300000);


  //sends "link to be opened" to main.js
  $("body").on('click',"a", function(){
    self.port.emit("linkClicked",$(this).attr('data'));
    return false;
  });
  
  //sends "link to be opened" to main.js
  $("body").on('click',".calendar", function(){
    self.port.emit("linkClicked",$(this).attr('data'));
    return false;
  });

  // refresh only if icon is refresh icon.
  // Makes sure that clicking a loading icon does not trigger fetchdata()
  $("body").on('click',".loading", function(){
    src = $('.loading').attr('src');
    if(src=="img/refresh-white.png") fetchdata();
  });
});

