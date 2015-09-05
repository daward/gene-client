var React = require('react');
var DataGrid = require('react-datagrid')
var Store = require('../stores/store.js')
var sorty = require('sorty')

var DeathStats = React.createClass({
	getInitialState: function() {
		var columns = [
		  { name: 'year', width: 50},
		  { name: 'starved', width: 100},
		  { name: 'old age', width: 100},
		  { name: 'eaten', width: 100},
		  { name: 'alive', width: 100},
		];
		
    return {data: Store.populationData, columns: columns, sortInfo:[{name: 'year', dir: 'desc', type: 'number'}]};
  },
  
  componentDidMount: function() {
    Store.addChangeListener(this.compute);
  },
  
  componentWillUnmount: function() {
    Store.removeChangeListener(this.compute);
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