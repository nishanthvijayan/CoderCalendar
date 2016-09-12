var React = require('react');
var UtilHelpers = require('../util');
var CalendarLink = require('./Contest/CalendarLink');
var ContestTime = require('./Contest/ContestTime');
var ContestImage = require('./Contest/ContestImage');
var ContestDuration = require('./Contest/ContestDuration');

var Contest = React.createClass({
    propTypes: {
        details:      React.PropTypes.object,
        type:      React.PropTypes.string
    },
    onClickContest: function(){
         chrome.tabs.create({url: this.props.details.url});
    },
    render: function(){
        return(
            <a className= 'contest' onClick={this.onClickContest}>
                <li>
                    <br/>
                    <h3>{this.props.details.Name}</h3>
                    <ContestImage platform={this.props.details.Platform} /> <br/>
                    <ContestTime type={this.props.type} details={this.props.details} /> <br/>
                    <ContestDuration type={this.props.type} details={this.props.details} /> <br/>
                    <CalendarLink type={this.props.type} details={this.props.details}/>
                </li>
                <hr/>
            </a>
        )
    }
});

module.exports = Contest;
