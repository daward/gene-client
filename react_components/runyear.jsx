var React  = require('react');
var AppDispatcher = require('../appDispatcher.js')

module.exports = React.createClass({
  getInitialState: function() {
	return { "currentAction" : "Run" }
  },

  handleRun: function(i) {
    AppDispatcher.dispatch({
        eventName: 'start-year',
    });
  },
  
  handleRunContinuous: function(i) {
    if(this.state.currentAction == "Run") {
		this.setState({ "currentAction" : "Pause" })
		AppDispatcher.dispatch({
			eventName: 'start-continuous',
		});
	}
	else {
		this.setState({ "currentAction" : "Run" })
		AppDispatcher.dispatch({
			eventName: 'stop-continuous',
		});
	}
  },

  render: function() {
    return (
	  <div>
		<button onClick={this.handleRun.bind(this)}>Run Single Year</button>
		<button onClick={this.handleRunContinuous.bind(this)}>{this.state.currentAction}</button>
	  </div>
    );
  }
});
