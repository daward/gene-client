var React  = require('react');
var _ = require('lodash-node');
var Store = require('../store.js')
var AppDispatcher = require('../appDispatcher.js')

module.exports = React.createClass({
  componentDidMount: function() {
	Store.addChangeListener(this.paint);
    this.paint();
  },  
  
  handleClick: function(event) {
	var x = Math.floor((event.offsetX - this.props.margin) / this.props.gridSize);
	var y = Math.floor((event.offsetY - this.props.margin) / this.props.gridSize);
	 AppDispatcher.dispatch({
        eventName: 'location-changed',
		x : x,
		y : y
    });
  },
  
  paint: function(context) 
  {  	
    var context = this.getDOMNode().getContext('2d');
	this.getDOMNode().addEventListener('click', this.handleClick)
	var bw = this.props.gridSize * Store.settings.dimensions.width;
	var bh = this.props.gridSize * Store.settings.dimensions.length;
	
    context.clearRect(0, 0, 1520, 1520);
	
	for (var x = 0; x <= bw; x += this.props.gridSize) {
		context.moveTo(0.5 + x + this.props.margin, this.props.margin);
		context.lineTo(0.5 + x + this.props.margin, bh + this.props.margin);
	}

	for (var x = 0; x <= bh; x += this.props.gridSize) {
		context.moveTo(this.props.margin, 0.5 + x + this.props.margin);
		context.lineTo(bw + this.props.margin, 0.5 + x + this.props.margin);
	}
	
	this.paintVegetation(context, Store.settings)
	
	context.fillStyle="#000000";
	var gridSize = this.props.gridSize, margin = this.props.margin
	_.forEach(Store.god.environment.getAllCreatures(), function(creature) {
		context.fillText("C", margin + creature.x * gridSize + 20, margin + creature.y * gridSize + 25);
	});
	
	context.strokeStyle = "black";
	context.stroke();
  },
  
  paintVegetation: function(context, settings) {
	
	for(var x = 0; x < settings.dimensions.width; x++) {
		for(var y = 0; y < settings.dimensions.length; y++) {
			var vegSize = Math.round(Store.god.environment.vegetationMap.get(x, y)[0].size)
		    context.fillStyle= this.getColor(vegSize)
			context.fillRect(this.props.margin + x * this.props.gridSize, this.props.margin + y * this.props.gridSize, this.props.margin + (x + 1) * this.props.gridSize, this.props.margin + (y + 1) * this.props.gridSize)
		}			
	}
  },
  
  getColor: function(value) {
	var startColor = [255, 255, 255];
	var endColor = [0, 153, 0];
	var endValue = 60;
	
	var pctValue = Math.min(value, endValue) / endValue;
	
	var color = "#"
	for(var i = 0; i < 3; i++) {
		color = color + (Math.round((endColor[i] - startColor[i]) * pctValue + startColor[i])).toString(16);
	}
	
	return color;
  },

  render: function() {
    return (
	  <canvas width={1520} height={1520}/>
    );
  }
});
