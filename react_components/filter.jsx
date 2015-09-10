var React = require('react');
var AppDispatcher = require('../appDispatcher.js')
var _ = require('lodash-node');
var FilterStore = require('../stores/filterStore.js');
var ReactSlider = require('react-slider');
var RangeSlider = require('./rangeSlider.jsx');
var mui = require('material-ui'),
	Slider = mui.Slider,
	Table = mui.Table,
	TableBody = mui.TableBody,
	TableHeader = mui.TableHeader,
	TableRow = mui.TableRow,
	TableHeaderColumn = mui.TableHeaderColumn,
	TableRowColumn = mui.TableRowColumn,
	TableFooter = mui.TableFooter,
	TextField = mui.TextField,
	Colors = mui.Colors;
	

var Filter = React.createClass({  

  getInitialState: function() {
  
	return {
	  fixedHeader: false,
	  fixedFooter: false,
	  stripedRows: false,
	  showRowHover: false,
	  selectable: true,
	  multiSelectable: true,
	  enableSelectAll: false,
	  deselectOnClickaway: false,
	  height: '700px',
	  filters: FilterStore.filters
	};
  },
  
  componentDidMount: function() {
    FilterStore.addChangeRangeListener(this.compute);
  },
  
  componentWillUnmount: function() {
    FilterStore.removeChangeRangeListener(this.compute);
  },
  
  compute: function() {
	this.state.filters = FilterStore.filters;
	this.setState(this.state);
  },
  
  changeValue: function(name, minValue, maxValue) {
	AppDispatcher.dispatch({
				eventName: 'filter-changed',
				name : name,
				minValue : minValue,
				maxValue: maxValue,
			});
  },
  
  onRowSelection: function(selectedRows) {
	AppDispatcher.dispatch({
				eventName: 'filters-enabled',
				value : selectedRows
			});
  },

  render: function() {
 
  var me = this;
  var rows = _.map(this.state.filters, function(filter) {
		return <TableRow selected={filter.enabled}>
			<TableRowColumn style={{fontSize:'20px'}}>{filter.name}</TableRowColumn>
			<TableRowColumn style={{paddingLeft:'5px', paddingRight:'5px'}}>
			    <RangeSlider min={filter.min} max={filter.max} onChange={function(min, max) { me.changeValue(filter.name, min, max) }}/>
			</TableRowColumn>
		</TableRow>
	});
  
    return (
	  <Table
  style={{width:'480px'}}
  height={this.state.height}
  fixedHeader={this.state.fixedHeader}
  fixedFooter={this.state.fixedFooter}
  selectable={this.state.selectable}
  multiSelectable={this.state.multiSelectable}
  onRowSelection={this.onRowSelection}>
  <TableHeader enableSelectAll={this.state.enableSelectAll}>
    <TableRow>
      <TableHeaderColumn tooltip='Filter Type'>Type</TableHeaderColumn>
      <TableHeaderColumn tooltip='Value'>Value</TableHeaderColumn>
    </TableRow>
  </TableHeader>
  <TableBody
    deselectOnClickaway={this.state.deselectOnClickaway}
    showRowHover={this.state.showRowHover}
    stripedRows={this.state.stripedRows}>
    {rows}
  </TableBody>
</Table>
    );
  }
});

module.exports = Filter;