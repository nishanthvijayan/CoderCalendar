
var res;
var req;



function putdata(json)
{ 
  $.each(res.result , function(i,post){ 
     $("body").append('<a data='+'"'+post.url+'"'+'><li>'+post.Name+'</li></a>');
    });
}


function fetchdata(){
  
    req =  new XMLHttpRequest();
    req.open("GET",'https://contesttrackerapi.herokuapp.com/',true);
    req.send();
    req.onload = function(){
        res = JSON.parse(req.responseText);
        putdata(res);
    };
}


$(document).ready(function(){
  fetchdata();
  // update feeds every 5 minutes
  setInterval(function(){
    $("a").remove();
    fetchdata() }, 100000)


//sends "link to be opened" to main.js
  $("body").on('click',"a", function(){
       self.port.emit("postClicked",$(this).attr('data'));
       return false;
     });

});

