var React  = require('react');
var AppDispatcher = require('../appDispatcher.js')
var _ = require('lodash-node');
var Shiva = require('../shiva.js')

var Store = require('../stores/store.js')
var AncestorStore = require('../stores/ancestorStore.js')
var CreatureStore = require('../stores/creatureStore.js')
var VegetationStore = require('../stores/vegetationStore.js')
var PopulationStore = require('../stores/populationStore.js');
var FilterStore = require('../stores/filterStore.js');

module.exports = React.createClass({

  componentDidMount: function() {
	AncestorStore.addChangeListener(this.paint);
	CreatureStore.addChangeListener(this.paint);
    PopulationStore.addChangeListener(this.paint);
	Store.addChangeListener(this.paint);
	VegetationStore.addChangeListener(this.paint);
	FilterStore.addChangeListener(this.paint);
	this.paint();
  },  
  
  handleClick: function(event) {
	var x = Math.floor((event.offsetX - this.props.margin) / this.props.gridSize);
	var y = Math.floor((event.offsetY - this.props.margin) / this.props.gridSize);
	
	if(x <= Shiva.settings.dimensions.width && y <= Shiva.settings.dimensions.length) {
	
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
	var bw = this.props.gridSize * Shiva.settings.dimensions.width;
	var bh = this.props.gridSize * Shiva.settings.dimensions.length;
	
    context.clearRect(0, 0, 1520, 1520);
	
	for (var x = 0; x <= bw; x += this.props.gridSize) {
		context.moveTo(0.5 + x + this.props.margin, this.props.margin);
		context.lineTo(0.5 + x + this.props.margin, bh + this.props.margin);
	}

	for (var x = 0; x <= bh; x += this.props.gridSize) {
		context.moveTo(this.props.margin, 0.5 + x + this.props.margin);
		context.lineTo(bw + this.props.margin, 0.5 + x + this.props.margin);
	}
	
	this.paintVegetation(context, Shiva.settings)
	
	this.paintCreatures(context);
	
	context.strokeStyle = "black";
	context.stroke();
  },
  
  getFillForCreature: function(creature) {
	if (creature.data.isMarked(_.map(PopulationStore.populations, "tag"))) {
		return "#FF8000"
	} else if(_.find(creature.data.ancestry, function(anc) { return anc.id == AncestorStore.ancestor})) {
		return "#FF0000";
	} else {
		return "#0000FF";
	}
  },
  
  paintCreatures: function(context) {
	
	var gridSize = this.props.gridSize, margin = this.props.margin, me = this;
	_.forEach(Shiva.environment.getAllCreatures(), function(creature) {
	
		if(!FilterStore.isVisible(creature.data)) {
			return;
		}
		
		context.fillStyle = me.getFillForCreature(creature);
		
		if(creature.data.id == CreatureStore.creature) {
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
		    var vegetation = Shiva.environment.vegetationMap.get(x, y)[0];
			var pctValue = VegetationStore.getDensity(vegetation);
			
		    context.fillStyle= this.getVegetationColor(pctValue)
			context.fillRect(
				this.props.margin + x * this.props.gridSize, 
				this.props.margin + y * this.props.gridSize, 
				this.props.gridSize, 
				this.props.gridSize)
		}			
	}
  },
  
  getVegetationColor: function(pctValue) {
	var startColor = [255, 255, 255];
	var endColor = [0, 153, 0];
	
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
