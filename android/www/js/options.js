$(document).ready(function(){

	$('#Hackerearth')[0].checked 	= ( localStorage.HACKEREARTH=="true" );
	$('#Hackerrank')[0].checked 		= ( localStorage.HACKERRANK=="true" );
	$('#Codechef')[0].checked 			= ( localStorage.CODECHEF=="true" );
	$('#Codeforces')[0].checked 		= ( localStorage.CODEFORCES=="true" );
	$('#Topcoder')[0].checked 			= ( localStorage.TOPCODER=="true" );
	$('#Google')[0].checked 			= ( localStorage.GOOGLE=="true" );
	$('#Other')[0].checked 				= ( localStorage.OTHER=="true" );

	$('#checkInterval')[0].value = localStorage.CHECKINTERVAL;

	$(':checkbox').change( function(){
		localStorage.HACKEREARTH = $('#Hackerearth')[0].checked;
		localStorage.HACKERRANK 		= $('#Hackerrank')[0].checked;
		localStorage.CODECHEF 			= $('#Codechef')[0].checked;
		localStorage.CODEFORCES 		= $('#Codeforces')[0].checked;
		localStorage.TOPCODER 			= $('#Topcoder')[0].checked;
		localStorage.GOOGLE 			= $('#Google')[0].checked;
		localStorage.OTHER				= $('#Other')[0].checked;
	});

	$('#checkInterval').change(function(){
		if($('#checkInterval')[0].value<5)$('#checkInterval')[0].value = 5;
		localStorage.CHECKINTERVAL = $('#checkInterval')[0].value;
	})
});