
var res;
var req;

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
  
  $.each(res.result.ongoing , function(i,post){ 
     
     $("#ongoing").append('<a  data='+'"'+post.url+'"'+'>\
     	<li><h4>'+post.Name+'</h4>\
     	<img src="'+icon(post.Platform)+'"></img><br>\
     	<h5>End: '+post.EndTime+'</h5><br>\
     	</li><hr></a>');
    });
  
  $.each(res.result.upcoming , function(i,post){ 

      startTime = Date.parse(post.StartTime)
      endTime   = Date.parse(post.EndTime)
      s = new Date(startTime+19800000).toISOString().slice(0,19).replace(/-/g,"").replace(/:/g,"")
      e = new Date(endTime+19800000).toISOString().slice(0,19).replace(/-/g,"").replace(/:/g,"")
      
      calenderTime = s+'/'+e
      calenderLink = "https://www.google.com/calendar/render?action=TEMPLATE&text="+encodeURIComponent(post.Name)+"&dates="+calenderTime+"&location="+post.url+"&pli=1&uid=&sf=true&output=xml#eventpage_6"
      
      $("#upcoming").append('<a  data='+'"'+post.url+'"'+'>\
      	<li><h4>'+post.Name+'</h4>\
      	<img src="'+icon(post.Platform)+'"></img><br>\
      	<h5>Start: '+post.StartTime+'</h5><br>\
      	<h5>Duration: '+post.Duration+'</h5><br>\
      	<h5 data='+calenderLink+' class="calender">Add to Calendar</h5>\
      	</li><hr></a>');
    });

}


function fetchdata(){

    req =  new XMLHttpRequest();
    req.open("GET",'https://contesttrackerapi.herokuapp.com/',true);
    req.send();
    req.onload = function(){
        $("a").remove();
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
  $("body").on('click',".calender", function(){
       self.port.emit("postClicked",$(this).attr('data'));
       return false;
     });
});

