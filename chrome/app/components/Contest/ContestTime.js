var React = require('react');
var UtilHelpers = require('../../util');

var ContestTime = React.createClass({
       render: function(){
            if (this.props.type == 'live'){
                var time = Date.parse(this.props.details.EndTime);
                var timeText = 'End';
            } else{
                var time = Date.parse(this.props.details.StartTime);
                var timeText = 'Start';
            }
            var timezoneCorrectedTime  = UtilHelpers.changeTimezone(time).toString().slice(0,21);
            var humanReadableTime = moment(timezoneCorrectedTime).fromNow();

            return (<h4>{timeText}: {timezoneCorrectedTime} ({humanReadableTime})</h4>)
        }
});

module.exports = ContestTime;
