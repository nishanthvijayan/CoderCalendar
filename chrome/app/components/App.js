var React = require('react');
var UtilHelpers = require('../util');
var Main = require('./Main');

var App = React.createClass({
    getInitialState: function(){
        return{
            contests: this.processData(UtilHelpers.appCache.fetch().data)
        }
    },
    processData: function(contests){
        return {
            ongoing: UtilHelpers.filterContestsBySettings(contests.ongoing),
            upcoming: UtilHelpers.filterContestsBySettings(contests.upcoming)
        };
    },
    getData: function(){
        // If cache is empty or old, fetch data from backend
        // TODO: Handle ajax fail case
       if (UtilHelpers.appCache.empty() || UtilHelpers.appCache.dataOlderThan(5)) {
            $.when( $.ajax( "https://contesttrackerapi.herokuapp.com/" )).then(function(data, textStatus, jqXHR){
                contests = data.result;

                UtilHelpers.appCache.store(contests);
                
                component.setState({
                    contests: this.processData(contests)
                });
            });
        }
    },
    componentDidMount: function(){
        component = this;
        UtilHelpers.initializeLocalStorage();
        this.getData();
        //  reset scroll pos if last scrolled time < 5 minutes ?
    },
    render: function(){
        return(<Main contests = {this.state.contests}/>)
    }
});

module.exports = App;
