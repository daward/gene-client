var React = require('react');
var DataGrid = require('react-datagrid')
var CreatureStore = require('../stores/creatureStore.js')
var AppDispatcher = require('../appDispatcher.js')
var PopulationButton = require('./PopulationButton.jsx')
var _ = require('lodash-node');

var mui = require('material-ui'),
	Toolbar = mui.Toolbar,
	ToolbarGroup = mui.ToolbarGroup,
	ToolbarTitle = mui.ToolbarTitle;
	

var CreatureInfo = React.createClass({
	getInitialState: function() {			
		var columns = [
		  { name: 'Name', width: 200},
		  { name: 'Value', width: 250},
		]
		
    return {data: CreatureStore.creatureInfo, columns: columns, sortInfo:[{name: 'children', dir: 'desc', type: 'number'}]};
  },
  
  componentDidMount: function() {
    CreatureStore.addChangeListener(this.compute);
    CreatureStore.addUpdateListener(this.compute);
  },
  
  componentWillUnmount: function() {
	CreatureStore.removeUpdateListener(this.compute);
	CreatureStore.removeChangeListener(this.compute);
  },
  
  compute: function() {
	this.setState({data: CreatureStore.creatureInfo, columns: this.state.columns, sortInfo: this.state.sortInfo})
  },
  
  sort: function(arr){
	return sorty(this.state.sortInfo, arr)
  },
  
  onSortChange : function(info){
	  this.state.sortInfo = info
	  data = sort(this.state.data.data)
  },

  
  toolbarStyle: {
	paddingBottom: "100px"
  },
  
  render: function() {
	return (
	  <div>
		  <Toolbar>
			<ToolbarGroup key={0} float="left">
				<ToolbarTitle text="Creature" />
			</ToolbarGroup>
			<ToolbarGroup key={1} float="right">
				<PopulationButton id={this.state.data.id} eventType="create-marker"/>
			</ToolbarGroup>
		  </Toolbar>
		  <DataGrid 
			idProperty="Name" 
			sortInfo={this.state.sortInfo}
			dataSource={this.state.data.data} 
			columns={this.state.columns} 
			style={{width: this.props.width, height: this.props.height}}/>
	  </div>
    );
  }
  
 })
 
 module.exports = CreatureInfo;