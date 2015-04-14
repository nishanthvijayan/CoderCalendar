var now;

// returns the relative path of the icon file
// corresponding to the platform of each post
function icon(platform){

  if(platform=="CODECHEF")          return "img/cc32.jpg";
  else if (platform=="HACKEREARTH") return "img/he32.png";
  else if (platform=="CODEFORCES")  return "img/cf32.png"; 
  else if(platform=="TOPCODER")     return "img/tc32.gif";
  else if(platform=="HACKERRANK")   return "img/hr36.png";
}

function putdata(json)
{ 
  
  $("#upcoming > a").remove();
  $("#ongoing > a").remove();
  $("hr").remove();


  $.each(json.result.ongoing , function(i,post){ 
     
    $("#ongoing").append('<a  data='+'"'+post.url+'"'+'>\
      <li><br><h3>'+post.Name+'</h3>\
      <img src="'+icon(post.Platform)+'"></img><br>\
      <h4>End: '+post.EndTime+'</h4><br>\
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
      <li><br><h3>'+post.Name+'</h3>\
      <img src="'+icon(post.Platform)+'"></img><br>\
      <h4>Start: '+post.StartTime+'</h4><br>\
      <h4>Duration: '+post.Duration+'</h4><br>\
      <h4 data='+calendarLink+' class="calendar">Add to Calendar</h4>\
      </li><hr></a>');
  });

}


function fetchdata(){

  imgToggle();
  req =  new XMLHttpRequest();
  req.open("GET",'https://contesttrackerapi.herokuapp.com/',true);
  req.send();
  req.onload = function(){
    res = JSON.parse(req.responseText);

    imgToggle();
    putdata(res);

    // cache creation
    localStorage.cache  = JSON.stringify(res);
    localStorage.time = now;
        
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
  
  now = (new Date()).getTime()/1000;
  if(!localStorage.cache || now - parseInt(localStorage.time) > 5*60){
    // cache is old or not set
    fetchdata();
  
  }
  else{
    // cache is fresh
    localData = JSON.parse(localStorage.cache);
    putdata(localData);
    //  restoring the scroll state from the localStorage
    if(localStorage.scrollTop){
        document.body.scrollTop = localStorage.scrollTop;
    }

  }

  setInterval(function(){  fetchdata(); }, 300000)

  // saves the scroll position of the document
  // which can be used to restore the scroll state later on
  addEventListener('scroll', function(){
    localStorage.scrollTop = document.body.scrollTop;
  });


  // opens a new tab with the url given by the
  // data attribute of the "a" tag that was clicked
  $("body").on('click',"a", function(){
    chrome.tabs.create({url: $(this).attr('data')});
    return false;
  });

  // opens a new tab with the url given by the
  // data attribute of the "h4" tag that was clicked
  $("body").on('click',".calendar", function(){
    chrome.tabs.create({url: $(this).attr('data')});
    return false;
  });

  // refresh only if icon is refresh icon.
  // Makes sure that clicking a loading icon does not trigger fetchdata()
  $("body").on('click',".loading", function(){
    src = $('.loading').attr('src');
    if(src=="img/refresh-white.png") fetchdata();
  });

});

