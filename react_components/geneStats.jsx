var React = require('react');
var DataGrid = require('react-datagrid');
var Store = require('../store.js');
var sorty = require('sorty');
var Gene = require('gene-sim');
var EnvironmentStats = require('../environmentStats.js')
var _ = require('lodash-node');

var GeneStats = React.createClass({
	getInitialState: function() {
		
		var columns = [
		  { name: 'year', width: 50},
		]
		
		_.forEach(Gene.Settings.traitTypes, function(trait) {
			columns.push({ name: trait, width: 50})
		});
		
    return {data: EnvironmentStats.geneticData, columns: columns, year: 0, sortInfo:[{name: 'year', dir: 'desc', type: 'number'}]};
  },
  
  componentDidMount: function() {
    Store.addChangeListener(this.compute);
  },
  
  compute: function() {
	this.setState({data: EnvironmentStats.geneticData, columns: this.state.columns, sortInfo: this.state.sortInfo})
  },
  
  sort: function(arr){
	return sorty(this.state.sortInfo, arr)
  },
  
  onSortChange : function(info){
	  this.state.sortInfo = info
	  data = sort(this.state.data)
	  //now refresh the grid
  },
  
  render: function() {
	  return (
	  <DataGrid 
		idProperty="year" 
		sortInfo={this.state.sortInfo}
		dataSource={this.sort(this.state.data)} 
		columns={this.state.columns} 
		style={{width: this.props.width, height: this.props.height}}/>
    );
  }
  
 })
 
 module.exports = GeneStats;