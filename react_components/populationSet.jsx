var React = require('react');
var Collapse = require('rc-collapse');
var PopulationInfo = require('./populationInfo.jsx');
var PopulationStore = require('../stores/populationStore.js');
var _ = require('lodash-node');
var Collapse = require('rc-collapse'),
	Panel = Collapse.Panel;

var PopulationSet = React.createClass({
	getInitialState: function() {			
		
    return { active: PopulationStore.populations, inactive: PopulationStore.inactivePopulations };
  },
  
  componentDidMount: function() {
    PopulationStore.addChangeListener(this.compute);
    PopulationStore.addUpdateListener(this.compute);
  },
  
  componentWillUnmount: function() {
	PopulationStore.removeChangeListener(this.compute);
    PopulationStore.removeUpdateListener(this.compute);
  },
  
  compute: function() {
	this.setState({ active: PopulationStore.populations, inactive: PopulationStore.inactivePopulations  })
  },

  render: function() {
	var panels = _.map(this.state.active, function(population) {
		return <Panel header={population.name()}>
				<PopulationInfo population={population} />
			</Panel>
	});
	
	var inactives = _.map(this.state.inactive, function(population) {
		return <div>{population.name()}</div>});
			
    return (
	<div>
		<h2>Active Populations</h2>
		<Collapse accordion={false}>
			{panels}		
		</Collapse>
		<h2>Inactive Populations</h2>
		{inactives}
	</div>
	);
  }
});

module.exports = PopulationSet;