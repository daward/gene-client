var React = require('react');
var DataGrid = require('react-datagrid')
var LocationStore = require('../stores/locationStore.js')
var sorty = require('sorty')
var AppDispatcher = require('../appDispatcher.js')

var mui = require('material-ui'),
	Toolbar = mui.Toolbar,
	ToolbarGroup = mui.ToolbarGroup,
	ToolbarTitle = mui.ToolbarTitle;

var LocationInfo = React.createClass({
	getInitialState: function() {			
		var columns = [
		  { name: 'Name', width: 200},
		  { name: 'Value', width: 250},
		]
		
    return {data: LocationStore.locationInfo, columns: columns, sortInfo:[{name: 'children', dir: 'desc', type: 'number'}]};
  },
  
  componentDidMount: function() {
	LocationStore.addUpdateListener(this.compute);
  },
  
  componentWillUnmount: function() {
	LocationStore.removeUpdateListener(this.compute);
  },
  
  compute: function() {
	this.setState({data: LocationStore.locationInfo, columns: this.state.columns, sortInfo: this.state.sortInfo})
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
	      <Toolbar>
			<ToolbarGroup key={0} float="left">
				<ToolbarTitle text="Location" />
			</ToolbarGroup>
		  </Toolbar>
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