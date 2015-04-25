$(document).ready(function(){
		
	$('#Hackerearthhiring')[0].checked 	= ( localStorage.HACKEREARTHhiring=="true" );
	$('#Hackerearthcontest')[0].checked = ( localStorage.HACKEREARTHcontest=="true" );
	$('#Hackerrank')[0].checked 		= ( localStorage.HACKERRANK=="true" );
	$('#Codechef')[0].checked 			= ( localStorage.CODECHEF=="true" );
	$('#Codeforces')[0].checked 		= ( localStorage.CODEFORCES=="true" );
	$('#Topcoder')[0].checked 			= ( localStorage.TOPCODER=="true" );

	$(':checkbox').change( function(){
		localStorage.HACKEREARTHhiring  = $('#Hackerearthhiring')[0].checked;
		localStorage.HACKEREARTHcontest = $('#Hackerearthcontest')[0].checked;
		localStorage.HACKERRANK 		= $('#Hackerrank')[0].checked;
		localStorage.CODECHEF 			= $('#Codechef')[0].checked;
		localStorage.CODEFORCES 		= $('#Codeforces')[0].checked;
		localStorage.TOPCODER 			= $('#Topcoder')[0].checked;
	});

});