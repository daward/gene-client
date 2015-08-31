var React = require('react');
var DataGrid = require('react-datagrid')
var Store = require('../store.js')
var EnvironmentStats = require('../environmentStats.js')
var sorty = require('sorty')
var AppDispatcher = require('../appDispatcher.js')

var CreatureInfo = React.createClass({
	getInitialState: function() {			
		var columns = [
		  { name: 'Name', width: 200},
		  { name: 'Value', width: 250},
		]
		
    return {data: EnvironmentStats.creatureInfo, columns: columns, sortInfo:[{name: 'children', dir: 'desc', type: 'number'}]};
  },
  
  componentDidMount: function() {
    Store.addChangeCreatureListener(this.compute);
  },
  
  componentWillUnmount: function() {
	Store.removeChangeCreatureListener(this.compute);
  },
  
  compute: function() {
	this.setState({data: EnvironmentStats.creatureInfo, columns: this.state.columns, sortInfo: this.state.sortInfo})
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
	  <div>
	      <h2>Creature Information</h2>
		  <DataGrid 
			idProperty="Name" 
			sortInfo={this.state.sortInfo}
			dataSource={this.state.data} 
			columns={this.state.columns} 
			style={{width: this.props.width, height: this.props.height}}/>
	  </div>
    );
  }
  
 })
 
 module.exports = CreatureInfo;