var React = require('react');
var Contest = require('./Contest');

var ContestList = React.createClass({
    render: function(){
        component = this;
        var contestNodes = this.props.contests.map(function(contest) {
            return (
                <Contest details={contest} type={component.props.type} />
            )
        });

        return(
            <div className = 'contest-list'>
            {contestNodes}
            </div>
        )
    }
});

module.exports = ContestList;
