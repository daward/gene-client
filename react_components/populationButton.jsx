var React = require('react');
var AppDispatcher = require('../appDispatcher.js');
var mui = require('material-ui'),
	IconButton = mui.IconButton;
	
var PopulationButton = React.createClass({

	handleClick : function() {
		AppDispatcher.dispatch({
			eventName: this.props.eventType,
			creature : this.props.id
		});	
	},

	buttonStyle: {
		fontSize: "36px"
	},

	render: function() {
		return (
			<IconButton 
				onClick={this.handleClick} 
				iconClassName="material-icons"  
				iconStyle={this.buttonStyle} 
				tooltipPosition="top-center" 
				tooltip="create population">
				pin_drop
			</IconButton>
				
		);
	}
  
 })
 
 module.exports = PopulationButton;