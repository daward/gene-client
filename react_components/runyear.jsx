var React  = require('react');
var AppDispatcher = require('../appDispatcher.js')

module.exports = React.createClass({
  handleClick: function(i) {
    AppDispatcher.dispatch({
        eventName: 'start-year',
    });
  },

  render: function() {
    return (
	  <button onClick={this.handleClick.bind(this)}>Run Year</button>
    );
  }
});
