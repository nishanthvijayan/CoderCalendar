var React = require('react');

var ContestDuration = React.createClass({
    render: function(){
        if (this.props.type == 'upcoming'){
            return <h4>Duration: {this.props.details.Duration}</h4>
        }else{
            return null
        }
    }
});

module.exports = ContestDuration;
