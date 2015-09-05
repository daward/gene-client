var React  = require('react');
var AppDispatcher = require('../appDispatcher.js')
var VegetationStore = require('../stores/vegetationStore.js')

var mui = require('material-ui'),
RaisedButton = mui.RaisedButton,
Toolbar = mui.Toolbar,
ToolbarGroup = mui.ToolbarGroup,
ToolbarTitle = mui.ToolbarTitle,
DropDownMenu = mui.DropDownMenu,
FontIcon = mui.FontIcon,
ToolbarSeparator = mui.ToolbarSeparator

	var iconMenuItems = [
	{ payload: 'size', text: 'Size' },
	{ payload: 'energy', text: 'Energy' },
	{ payload: 'nutrition', text: 'Nutrition' }
	];

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
  
  onChange: function(e, selectedIndex, menuItem) {
	AppDispatcher.dispatch({
			eventName: 'vegetation-view-change',
			viewType: menuItem.payload
		});
  },

  render: function() {
    return (
	  <div>
		<Toolbar>		  
		  <ToolbarGroup key={0} float="left">
			<ToolbarTitle text="Vegetation View" />
			<FontIcon className="mui-icon-sort" />
			<DropDownMenu menuItems={iconMenuItems} onChange={this.onChange}/>
		  </ToolbarGroup>
		  <ToolbarGroup key={1} float="right">
			<RaisedButton onClick={ this.handleRun } label="Run Single Year" />
			<RaisedButton onClick={ this.handleRunContinuous } label={this.state.currentAction}/>
		  </ToolbarGroup>
		</Toolbar>
		
	  </div>
    );
  }
});
