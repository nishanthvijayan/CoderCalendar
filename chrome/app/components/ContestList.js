var React = require('react');
var Contest = require('./Contest');

var ContestList = React.createClass({
    render: function(){
        component = this;
        return(
            <div className = 'contest-list'>
                {this.props.contests.map(function(contest) {
                    return <Contest details={contest} type={component.props.type} />
                })}
            </div>
        )
    }
});

module.exports = ContestList;
