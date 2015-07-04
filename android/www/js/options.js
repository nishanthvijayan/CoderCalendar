$(document).ready(function(){
	
	$("li > .fa").each(function(){
		id = $(this).attr("id");
		if(localStorage.getItem(id)=="true"){
			$(this).addClass("fa-check green-text");
			$(this).removeClass("fa-times red-text");
		}else{
			$(this).removeClass("fa-check green-text");
			$(this).addClass("fa-times red-text");
		}
	});

	$("li > .fa").click(function(){
		id = $(this).attr("id");
		if($(this).hasClass("fa-check")){
			localStorage.setItem(id,"false");
			$(this).removeClass("fa-check green-text");
			$(this).addClass("fa-times red-text");
		}else{
			localStorage.setItem(id,"true");
			$(this).addClass("fa-check green-text");
			$(this).removeClass("fa-times red-text");
		}
	})	


	$('.orange-text').click(function(){
		url = $(this).attr('data-url');
		window.open(url, "_system");
	})

});

document.addEventListener("deviceready", function(){
	window.analytics.trackView('Settings');
});