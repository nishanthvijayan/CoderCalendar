var React = require('react');
var UtilHelpers = require('../../util');

var ContestImage = function ContestImage(props){
        return(<img className = 'contest-image' src={UtilHelpers.icon(props.platform)} title={props.platform}></img>)
};

module.exports = ContestImage;
