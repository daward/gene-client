var React = require('react');
var DataGrid = require('react-datagrid')
var Store = require('../store.js')
var sorty = require('sorty')

var DeathStats = React.createClass({
	getInitialState: function() {
		var data = []
		
		var columns = [
		  { name: 'year', width: 50},
		  { name: 'starved', width: 100},
		  { name: 'old age', width: 100},
		  { name: 'eaten', width: 100},
		  { name: 'alive', width: 100},
		]

	Store.addChangeListener(this.compute);
		
    return {data: data, columns: columns, sortInfo:[{name: 'year', dir: 'desc', type: 'number'}]};
  },
  
  compute: function() {
	this.setState({data: Store.populationData, columns: this.state.columns, sortInfo: this.state.sortInfo})
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
 
 module.exports = DeathStats;