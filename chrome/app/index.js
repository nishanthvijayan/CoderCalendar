var React = require('react');
var ReactDOM = require('react-dom');
var App = require('./components/App')
var UtilHelpers = require('./util');

$(document).ready(function(){
    UtilHelpers.checkIfFirstRun();
    ReactDOM.render(<App />, document.getElementById('ui-content'));
});
