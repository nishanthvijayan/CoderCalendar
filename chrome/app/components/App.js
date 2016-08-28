var React = require('react');
var Main = require('./Main');
var Cache = require('../appCache');

var App = React.createClass({
    getInitialState: function(){
        return{
            contests: this.processContestList(Cache.fetch().data)
        }
    },
    initializeSettings: function(){
        supportedPlatforms = ['HACKEREARTH', 'HACKERRANK', 'CODECHEF', 'CODEFORCES', 'TOPCODER', 'GOOGLE', 'OTHER'];
        $.each(supportedPlatforms,function(i, platform){
            if(!localStorage.getItem(platform)) localStorage.setItem(platform,'true');
        });
    },
    filterContestsBySettings: function(contests){
        filteredContests = contests.filter(function(contest){
            return !!(localStorage.getItem(contest.Platform));
        });
        return filteredContests;
    },
    filterContestsByTime: function(allContests){
        currentTime  = new Date().getTime();
        filteredContests = {}

        // Remove contests that are already over from ongoing contests list
        filteredContests.ongoing = allContests.ongoing.filter(function(contest){
            endTime   = Date.parse(contest.EndTime);
            return (endTime > curTime);
        });

        // Move contests that have started, to ongoing events list
        $.each(allContests.upcoming, function(i, contest){
            startTime = Date.parse(contest.StartTime);
            endTime   = Date.parse(contest.EndTime);
            if(startTime < curTime && endTime > curTime){
                filteredContests.ongoing.push(contest)
            }
        });

        //  Remove contests that have started/ended from upcoming contests list
        filteredContests.upcoming = allContests.upcoming.filter(function(contest){
            startTime = Date.parse(contest.StartTime);
            endTime   = Date.parse(contest.EndTime);
            return (startTime > curTime && endTime > curTime);
        });

        return filteredContests;
    },
    processContestList: function(contests){
        contestsFilteredBySettings =  {
            ongoing: this.filterContestsBySettings(contests.ongoing),
            upcoming: this.filterContestsBySettings(contests.upcoming)
        };
        return this.filterContestsByTime(contestsFilteredBySettings);
    },
    getContestList: function(){
        // If cache is empty or old, fetch data from backend
        // TODO: Handle ajax fail case
        component = this;
        if (Cache.empty() || Cache.dataOlderThan(5)) {
            $.when( $.ajax( "https://contesttrackerapi.herokuapp.com/" )).then(function(data, textStatus, jqXHR){
                contests = data.result;

                Cache.store(contests);

                component.setState({
                    contests: this.processContestList(contests)
                });
            });
        }
    },
    componentDidMount: function(){
        this.initializeSettings();
        this.getContestList();
        //  TODO: Reset scroll position if last scrolled time < 5 minutes ?
    },
    render: function(){
        return <Main contests = {this.state.contests}/>
    }
});

module.exports = App;
