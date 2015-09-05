var React = require('react');
var DataGrid = require('react-datagrid');
var PopulationStore = require('../stores/populationStore.js')
var sorty = require('sorty');
var Gene = require('gene-sim');
var _ = require('lodash-node');

var GeneStats = React.createClass({
	getInitialState: function() {
		var me = this;
		var columns = [
		  { name: 'year', width: 40},
		]
		
		_.forEach(Gene.Settings.traitTypes, function(trait) {
			columns.push({ name: trait, width: 50 })
		});
		
//	render: function(value, data, props) { 
//				var maxLen = Math.min(me.state.data.length - 1, props.rowIndex + 10)
//				if(me.state.data[props.rowIndex][trait] < me.state.data[maxLen][trait]) {
//					props.style.color = "red"
//				}
//				
//				if(me.state.data[props.rowIndex][trait] > me.state.data[maxLen][trait]) {
//					props.style.color = "green"
//				}
//				
//				return value;
				
		
    return {data: this.props.population.geneticData, columns: columns, year: 0, sortInfo:[{name: 'year', dir: 'desc', type: 'number'}]};
  },
  
  componentDidMount: function() {
    PopulationStore.addUpdateListener(this.compute);
  },
  
  componentWillUnmount: function() {
	PopulationStore.removeUpdateListener(this.compute);
  },
  
  compute: function() {
	this.setState({data: this.props.population.geneticData, columns: this.state.columns, sortInfo: this.state.sortInfo})
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