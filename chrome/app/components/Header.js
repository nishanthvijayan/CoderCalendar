var React = require('react');

var Header = React.createClass({
    onClickGitHub: function(){
        chrome.tabs.create({ url: "https://bit.ly/1LUziPN" });
    },
    onClickAndroid: function(){
        chrome.tabs.create({ url: "https://bit.ly/1KqFi3U" });
    },
    onClickSettings: function(){
        chrome.tabs.create({ url: "options.html" });
    },
    render: function(){
        return(
            <header>
                <i className="fa fa-code fa-2x gh-btn" onClick={this.onClickGitHub} />
                <i className="fa fa-android fa-2x"  onClick={this.onClickAndroid} />
                <h3>Coder Calendar</h3>
                <i className="fa fa-gear fa-2x" onClick={this.onClickSettings} />
            </header>
        )
    }
});

module.exports = Header;
