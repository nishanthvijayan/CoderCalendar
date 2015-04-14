
function icon(platform){

  if(platform=="CODECHEF")          return "cc32.jpg";
  else if (platform=="HACKEREARTH") return "he32.png";
  else if (platform=="CODEFORCES")  return "cf32.png"; 
  else if(platform=="TOPCODER")     return "tc32.gif";
  else if(platform=="HACKERRANK")   return "hr36.png";
}

function putdata(json)
{ 
  
  $.each(json.result.ongoing , function(i,post){ 
     
     $("#ongoing").append('<a  data='+'"'+post.url+'"'+'>\
     	<li><br><h4>'+post.Name+'</h4>\
     	<img src="'+icon(post.Platform)+'"></img><br>\
     	<h5>End: '+post.EndTime+'</h5><br>\
     	</li><hr></a>');
    });
  
  $.each(json.result.upcoming , function(i,post){ 

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


function fetchdata(){

	$("#imgAjaxLoader").show();
    req =  new XMLHttpRequest();
    req.open("GET",'https://contesttrackerapi.herokuapp.com/',true);
    req.send();
    req.onload = function(){
        $("#upcoming > a").remove();
        $("#ongoing > a").remove();
        $("#imgAjaxLoader").hide();
        res = JSON.parse(req.responseText);
        putdata(res);
    };
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
});

