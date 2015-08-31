var React = require('react');
var DataGrid = require('react-datagrid')
var Store = require('../store.js')
var EnvironmentStats = require('../environmentStats.js')
var sorty = require('sorty')
var AppDispatcher = require('../appDispatcher.js')

var LocationInfo = React.createClass({
	getInitialState: function() {			
		var columns = [
		  { name: 'Name', width: 200},
		  { name: 'Value', width: 250},
		]
		
    return {data: EnvironmentStats.locationInfo, columns: columns, sortInfo:[{name: 'children', dir: 'desc', type: 'number'}]};
  },
  
  componentDidMount: function() {
	Store.addChangeLocationListener(this.compute);
  },
  
  componentWillUnmount: function() {
	Store.removeChangeLocationListener(this.compute);
  },
  
  compute: function() {
	this.setState({data: EnvironmentStats.locationInfo, columns: this.state.columns, sortInfo: this.state.sortInfo})
  },
  
  sort: function(arr){
	return sorty(this.state.sortInfo, arr)
  },
  
  onSelectionChange: function(newSelectedId, data){
		if(data.Name == "creature")	{
			AppDispatcher.dispatch({
				eventName: 'select-creature',
				creature : data.Value
			});
		}
	},
  
  onSortChange : function(info){
	  this.state.sortInfo = info
	  data = sort(this.state.data)
  },
  
  render: function() {
	return (
	  <div>
	      <h2>Location Information</h2>
		  <DataGrid 
			idProperty="Name" 
			sortInfo={this.state.sortInfo}
			dataSource={this.state.data} 
			columns={this.state.columns} 
			selected={1}
			onSelectionChange={this.onSelectionChange}
			style={{width: this.props.width, height: this.props.height}}/>
	  </div>
    );
  }
  
 })
 
 module.exports = LocationInfo;