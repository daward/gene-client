var React = require('react');
var PopulationStore = require('../stores/populationStore.js');
var FilterStore = require('../stores/filterStore.js');
var PopulationButton = require('./PopulationButton.jsx')

var mui = require('material-ui'),
	Toolbar = mui.Toolbar,
	ToolbarGroup = mui.ToolbarGroup,
	ToolbarTitle = mui.ToolbarTitle;

var FilterToolbar = React.createClass({  
	
	getInitialState: function() {
		return {
			visible: FilterStore.visibleCreatures().length,
			total: PopulationStore.populations[0].size()
		};
	},
	
	componentDidMount: function() {
		FilterStore.addChangeRangeListener(this.setFilterSize);
		FilterStore.addChangeListener(this.setFilterSize);
		PopulationStore.addUpdateListener(this.setTotalSize)
	},
  
	componentWillUnmount: function() {
		FilterStore.removeChangeRangeListener(this.setFilterSize);
		FilterStore.removeChangeListener(this.compute);
		PopulationStore.removeUpdateListener(this.setTotalSize)
	},

	setFilterSize: function() {
		this.state.visible = FilterStore.visibleCreatures().length
		this.setState(this.state);
	},
	
	setTotalSize: function() {		
		this.state.total = PopulationStore.populations[0].size()
		this.setState(this.state);
	},
	
	render: function() {
		
		var toolBarText = "Filtered Creatures (" + this.state.visible + " of " + this.state.total + ")"
		return (
			<Toolbar>
				<ToolbarGroup key={0} float="left">
					<ToolbarTitle text={{toolBarText}}/>
				</ToolbarGroup>
				<ToolbarGroup key={1} float="right">
					<PopulationButton eventType="create-filter-marker"/>
				</ToolbarGroup>
			</Toolbar>
		);
	}
	
});

module.exports = FilterToolbar;