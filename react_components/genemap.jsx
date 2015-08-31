var React  = require('react');
var _ = require('lodash-node');
var Store = require('../store.js')
var AppDispatcher = require('../appDispatcher.js')

module.exports = React.createClass({
  componentDidMount: function() {
	Store.addChangeAncestorListener(this.paint);
	Store.addChangeCreatureListener(this.paint);
    this.paint();
  },  
  
  handleClick: function(event) {
	var x = Math.floor((event.offsetX - this.props.margin) / this.props.gridSize);
	var y = Math.floor((event.offsetY - this.props.margin) / this.props.gridSize);
	
	if(x <= Store.settings.dimensions.width && y <= Store.settings.dimensions.length) {
	
		 AppDispatcher.dispatch({
			eventName: 'location-changed',
			x : x,
			y : y
		});
	}
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
	
	this.paintCreatures(context);
	
	context.strokeStyle = "black";
	context.stroke();
  },
  
  paintCreatures: function(context) {
	
	var gridSize = this.props.gridSize, margin = this.props.margin
	_.forEach(Store.god.environment.getAllCreatures(), function(creature) {
	
		if(_.find(creature.data.ancestry, function(anc) { return anc.id == Store.ancestor})) {
			context.fillStyle="#FF0000";
		} else {
			context.fillStyle="#0000FF";
		}
		
		if(creature.data.id == Store.creature) {
			var padding = 3
			
			context.fillRect(
				margin + creature.x * gridSize + gridSize / 3 - padding, 
				margin + creature.y * gridSize + gridSize / 3 - padding, 
				gridSize / 3 + padding * 2, 
				gridSize / 3 + padding * 2)
				
			context.clearRect(
				margin + creature.x * gridSize + gridSize / 3 - padding - 1, 
				margin + creature.y * gridSize + gridSize / 3 - padding - 1, 
				gridSize / 3 + padding * 2 - 1, 
				gridSize / 3 + padding * 2 - 1)
		}
		
		context.fillRect(
			margin + creature.x * gridSize + gridSize / 3, 
			margin + creature.y * gridSize + gridSize / 3, 
			gridSize / 3, 
			gridSize / 3)
			
			
	});
  },
  
  paintVegetation: function(context, settings) {
	
	for(var x = 0; x < settings.dimensions.width; x++) {
		for(var y = 0; y < settings.dimensions.length; y++) {
			var vegSize = Math.round(Store.god.environment.vegetationMap.get(x, y)[0].size)
		    context.fillStyle= this.getColor(vegSize)
			context.fillRect(
				this.props.margin + x * this.props.gridSize, 
				this.props.margin + y * this.props.gridSize, 
				this.props.gridSize, 
				this.props.gridSize)
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
