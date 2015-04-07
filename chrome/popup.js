
var res;
var req;

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
  
  $.each(res.result.ongoing , function(i,post){ 
     console.log(post.Name);
     $("#ongoing").append('<a  data='+'"'+post.url+'"'+'><li><h4>'+post.Name+'</h4><img src="'+icon(post.Platform)+'"></img><br><h5>End: '+post.EndTime+'</h5><br></li><hr></a>');
    });
  
  $.each(res.result.upcoming , function(i,post){ 
      console.log(post.Name);
      startTime = Date.parse(post.StartTime)
      endTime   = Date.parse(post.EndTime)
      s = new Date(startTime+19800000).toISOString().slice(0,19).replace(/-/g,"").replace(/:/g,"")
      e = new Date(endTime+19800000).toISOString().slice(0,19).replace(/-/g,"").replace(/:/g,"")
      calenderTime = s+'/'+e
      calenderLink = "https://www.google.com/calendar/render?action=TEMPLATE&text="+encodeURIComponent(post.Name)+"&dates="+calenderTime+"&location="+post.url+"&pli=1&uid=&sf=true&output=xml#eventpage_6"
     $("#upcoming").append('<a  data='+'"'+post.url+'"'+'><li><h4>'+post.Name+'</h4><img src="'+icon(post.Platform)+'"></img><br><h5>Start: '+post.StartTime+'</h5><br><h5>Duration: '+post.Duration+'</h5><br><h5 data='+calenderLink+' class="calender">Add to Calendar</h5></li><hr></a>');
    });

}


function fetchdata(){

    req =  new XMLHttpRequest();
    req.open("GET",'https://contesttrackerapi.herokuapp.com/',true);
    req.send();
    req.onload = function(){
        console.log("Hail Hydra");
        $("a").remove();
        res = JSON.parse(req.responseText);
        putdata(res);
    };
}



$(document).ready(function(){

  fetchdata();

  $("body").on('click',"a", function(){
       chrome.tabs.create({url: $(this).attr('data')});
       return false;
     });
  $("body").on('click',".calender", function(){
       chrome.tabs.create({url: $(this).attr('data')});
       return false;
     });

});

