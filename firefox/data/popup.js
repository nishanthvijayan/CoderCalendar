
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
      return "tc32.gif"
  }
}

function putdata(json)
{ 
  
  $.each(res.result.ongoing , function(i,post){ 
     
     $("#ongoing").append('<a  data='+'"'+post.url+'"'+'><li><h4>'+post.Name+'</h4><img src="'+icon(post.Platform)+'"></img><br><h5>End: '+post.EndTime+'</h5></li><hr></a>');
    });
  
  $.each(res.result.upcoming , function(i,post){ 

     $("#upcoming").append('<a  data='+'"'+post.url+'"'+'><li><h4>'+post.Name+'</h4><img src="'+icon(post.Platform)+'"></img><br><h5>Start: '+post.StartTime+'</h5><br><h5>Duration: '+post.Duration+'</h5></li><hr></a>');
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

});

