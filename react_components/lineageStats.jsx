var React = require('react');
var DataGrid = require('react-datagrid')
var PopulationStore = require('../stores/populationStore.js')
var sorty = require('sorty')
var AppDispatcher = require('../appDispatcher.js')
var PopulationButton = require('./PopulationButton.jsx')

var mui = require('material-ui'),
Toolbar = mui.Toolbar,
ToolbarGroup = mui.ToolbarGroup,
ToolbarTitle = mui.ToolbarTitle;

var LineageStats = React.createClass({
	getInitialState: function() {		
		var columns = [
		  { name: 'ancestor', width: 150},
		  { name: 'children', width: 150},
		  { name: 'percentage', width: 150},
		]
		
	var selected = null;
	if(this.props.population.ancestorList && this.props.population.ancestorList.length > 0) {
		selected  = this.props.population.ancestorList[0].ancestor;
	}
		
    return {	
		data: this.props.population.ancestorList, 
		columns: columns, 
		selected: selected,
		sortInfo:[{name: 'children', dir: 'desc', type: 'number'}]};
  },
  
  componentDidMount: function() {
    PopulationStore.addUpdateListener(this.compute);
  },
  
  componentWillUnmount: function() {
	PopulationStore.removeUpdateListener(this.compute);
  },
  
  compute: function() {
	this.setState({data: this.props.population.ancestorList, columns: this.state.columns, sortInfo: this.state.sortInfo})
  },
  
  sort: function(arr){
	return sorty(this.state.sortInfo, arr)
  },
  
  onSortChange : function(info){
	  this.state.sortInfo = info
	  data = sort(this.state.data)
  },
  
  onSelectionChange: function(newSelectedId, data){
		this.state.selected = newSelectedId;
		this.setState(this.state);
		
		AppDispatcher.dispatch({
			eventName: 'select-ancestor',
			creature : data.ancestor
		});

	},
  
  render: function() {
	return (
	<div>
	  <Toolbar>
		<ToolbarGroup key={0} float="left">
			<ToolbarTitle text="Successful Ancestors" />
		</ToolbarGroup>
		<ToolbarGroup key={1} float="right">
			<PopulationButton id={ this.state.selected } eventType="create-ancestor-marker"/>
		</ToolbarGroup>
	  </Toolbar>
	  
	  <DataGrid 
		idProperty="ancestor" 
		sortInfo={this.state.sortInfo}
		dataSource={this.sort(this.state.data)} 
		columns={this.state.columns} 
		selected={this.state.selected}
		onSelectionChange={this.onSelectionChange}
		style={{width: this.props.width, height: this.props.height}}/>
	</div>
    );
  }
  
 })
 
 module.exports = LineageStats;