var React = require('react');
var UtilHelpers = require('../../util');

var CalendarLink = React.createClass({
    onClickCalendarLink: function(){
        chrome.tabs.create({url: this.state.url});
    },
    componentDidMount: function(){
        if (this.props.type == 'upcoming'){
            this.setState({
                url: UtilHelpers.constructGoogleCalendarLink(this.props.details)
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
