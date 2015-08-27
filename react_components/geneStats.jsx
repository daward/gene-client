var React = require('react');
var DataGrid = require('react-datagrid');
var Store = require('../store.js');
var sorty = require('sorty');
var Gene = require('gene-sim');
var _ = require('lodash-node');

var GeneStats = React.createClass({
	getInitialState: function() {
		var data = []
		
		var columns = [
		  { name: 'year', width: 50},
		]
		
		_.forEach(Gene.Settings.traitTypes, function(trait) {
			columns.push({ name: trait, width: 50})
		})		

	Store.addChangeListener(this.compute);
		
    return {data: data, columns: columns, year: 0, sortInfo:[{name: 'year', dir: 'desc', type: 'number'}]};
  },
  
  compute: function() {
	this.setState({data: Store.geneticData, columns: this.state.columns, sortInfo: this.state.sortInfo})
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