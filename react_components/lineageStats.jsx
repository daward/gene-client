var React = require('react');
var DataGrid = require('react-datagrid')
var Store = require('../store.js')
var EnvironmentStats = require('../environmentStats.js')
var sorty = require('sorty')

var LineageStats = React.createClass({
	getInitialState: function() {		
		var columns = [
		  { name: 'ancestor', width: 150},
		  { name: 'children', width: 150},
		  { name: 'percentage', width: 150},
		]
		
    return {data: EnvironmentStats.ancestorList, columns: columns, sortInfo:[{name: 'children', dir: 'desc', type: 'number'}]};
  },
  
  componentDidMount: function() {
    Store.addChangeListener(this.compute);
  },
  
  compute: function() {
	this.setState({data: EnvironmentStats.ancestorList, columns: this.state.columns, sortInfo: this.state.sortInfo})
  },
  
  sort: function(arr){
	return sorty(this.state.sortInfo, arr)
  },
  
  onSortChange : function(info){
	  this.state.sortInfo = info
	  data = sort(this.state.data)
  },
  
  render: function() {
	return (
	  <DataGrid 
		idProperty="ancestor" 
		sortInfo={this.state.sortInfo}
		dataSource={this.sort(this.state.data)} 
		columns={this.state.columns} 
		style={{width: this.props.width, height: this.props.height}}/>
    );
  }
  
 })
 
 module.exports = LineageStats;