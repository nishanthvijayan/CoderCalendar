var React = require('react');
var UtilHelpers = require('../../util');

var CalendarLink = React.createClass({
    constructGoogleCalendarLink: function(contest){
        var curTime  = new Date();
        var startTime = Date.parse(contest.StartTime);
        var endTime = Date.parse(contest.EndTime);
        var s = new Date(UtilHelpers.changeTimezone(startTime).getTime() - ((curTime).getTimezoneOffset()*60000 )).toISOString().slice(0,19).replace(/-/g,"").replace(/:/g,"");
        var e = new Date(UtilHelpers.changeTimezone(endTime).getTime() - ((curTime).getTimezoneOffset()*60000 )).toISOString().slice(0,19).replace(/-/g,"").replace(/:/g,"");    
        var calendarTime = s+'/'+e
        return "https://www.google.com/calendar/render?action=TEMPLATE&text="+encodeURIComponent(contest.Name)+
                   "&dates="+calendarTime+"&location="+contest.url+"&pli=1&uid=&sf=true&output=xml#eventpage_6";
    },
    onClickCalendarLink: function(){
        chrome.tabs.create({url: this.state.url});
    },
    componentDidMount: function(){
        if (this.props.type == 'upcoming'){
            this.setState({
                url: this.constructGoogleCalendarLink(this.props.details)
            });
        }
    },
    render: function(){
        if (this.props.type == 'upcoming'){
            return(
                <h4 className="calendar" onClick={this.onClickCalendarLink}>Add to Calendar</h4>
            )
        }else{
            return null
        }
    }
});

module.exports = CalendarLink;
