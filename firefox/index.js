function fetchdata(){
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
setInterval(fetchdata(),1800000);