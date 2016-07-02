$(document).ready(function(){

    //initializing preference values in care they are not set.
    if(!localStorage.HACKEREARTH)localStorage.HACKEREARTH = "true";
    if(!localStorage.HACKERRANK)localStorage.HACKERRANK = "true";
    if(!localStorage.CODECHEF)localStorage.CODECHEF = 'true';
    if(!localStorage.CODEFORCES)localStorage.CODEFORCES = 'true';
    if(!localStorage.TOPCODER)localStorage.TOPCODER = 'true';
    if(!localStorage.GOOGLE)localStorage.GOOGLE = 'true';
    if(!localStorage.OTHER)localStorage.OTHER = 'true';

    $('#Hackerearth')[0].checked = ( localStorage.HACKEREARTH=="true" );
    $('#Hackerrank')[0].checked         = ( localStorage.HACKERRANK=="true" );
    $('#Codechef')[0].checked           = ( localStorage.CODECHEF=="true" );
    $('#Codeforces')[0].checked         = ( localStorage.CODEFORCES=="true" );
    $('#Topcoder')[0].checked           = ( localStorage.TOPCODER=="true" );
    $('#Google')[0].checked             = ( localStorage.GOOGLE=="true" );
    $('#Other')[0].checked              = ( localStorage.OTHER=="true" );

    $(':checkbox').change( function(){
        localStorage.HACKEREARTH  = $('#Hackerearth')[0].checked;
        localStorage.HACKERRANK         = $('#Hackerrank')[0].checked;
        localStorage.CODECHEF           = $('#Codechef')[0].checked;
        localStorage.CODEFORCES         = $('#Codeforces')[0].checked;
        localStorage.TOPCODER           = $('#Topcoder')[0].checked;
        localStorage.GOOGLE             = $('#Google')[0].checked;
        localStorage.OTHER              = $('#Other')[0].checked;
    });
});