var React = require('react');
var ReactDOM = require('react-dom');
var App = require('./components/App')

$(document).ready(function(){
    ReactDOM.render(<App />, document.getElementById('ui-content'));
});
