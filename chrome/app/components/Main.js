var React = require('react');
var Header = require('./Header');
var ContestTypeHeader = require('./ContestTypeHeader');
var ContestList = require('./ContestList');

var Main = React.createClass({
    render: function(){
        return(
            <div className = 'main-container'>
                <Header />
                <div id='ongoing'>
                    <ContestTypeHeader type="Live" />
                    <ContestList contests={this.props.contests.ongoing} type='live' />
                </div>
                <div id='upcoming'>
                    <ContestTypeHeader type="Upcoming" />
                    <ContestList contests={this.props.contests.upcoming} type='upcoming' />
                </div>
            </div>
        )
    }
});

module.exports = Main;
