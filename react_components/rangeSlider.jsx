var React = require('react');
var RangeSlider = React.createClass({  

  getInitialState: function() {
	return {minValue: 25, maxValue:75};
  },
  
  componentDidMount: function() {
	$(React.findDOMNode(this)).slider({
      range: true,
      min: this.props.min,
      max: this.props.max,
      values: [ this.state.minValue, this.state.maxValue ],
      slide: this.handleSlide,
	  change: this.change,
    });

  },
  
  componentWillUnmount: function() {
  },
  
  handleSlide: function(event, ui) {
	this.state.minValue = ui.values[ 0 ];
	this.state.maxValue = ui.values[ 1 ];
	this.setState(this.state);
  },
  
  change: function( event, ui ) {
	this.props.onChange(ui.values[0], ui.values[1]);
  },
  
  componentDidUpdate: function() {
	$(React.findDOMNode(this)).slider( "option", "max", this.props.max );
  },

  render: function() {
  
	return (
	<div>
		<p>
		({this.props.max}){this.state.minValue} - {this.state.maxValue}
		</p>
		<div id="slider-range"></div>
	</div>)
  }
});

module.exports = RangeSlider;