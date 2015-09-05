var React = require('react');
var GeneStats = require('./geneStats.jsx')
var LineageStats = require('./lineageStats.jsx')


var PopulationInfo = React.createClass({

  render: function() {
  return (
		<div>
			<GeneStats width={490} height={400} population={this.props.population}/>
			<LineageStats width={490} height={400} population={this.props.population}/>
		</div>);
	}
});

module.exports = PopulationInfo;