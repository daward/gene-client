var React  = require('react');
var _ = require('lodash-node');
var Store = require('../store.js')

module.exports = React.createClass({
  componentDidMount: function() {
	Store.addChangeListener(this.paint);
    this.paint();
  },  
  
  paint: function(context) 
  {  	
    var context = this.getDOMNode().getContext('2d');
	var god = Store.god;
	var settings = Store.settings;
	var gridSize = 30;
	var bw = gridSize * settings.dimensions.width;
	var bh = gridSize * settings.dimensions.length;
	var p = 10;
	
    context.clearRect(0, 0, 1520, 1520);
	
	for (var x = 0; x <= bw; x += gridSize) {
		context.moveTo(0.5 + x + p, p);
		context.lineTo(0.5 + x + p, bh + p);
	}

	for (var x = 0; x <= bh; x += gridSize) {
		context.moveTo(p, 0.5 + x + p);
		context.lineTo(bw + p, 0.5 + x + p);
	}
	
	for(var x = 0; x < settings.dimensions.width; x++) {
		for(var y = 0; y < settings.dimensions.length; y++) {
			context.fillText(Math.round(god.environment.vegetationMap.get(x, y).size), p + x * gridSize + 5, p + y * gridSize + 15);
		}			
	}
	
	_.forEach(god.environment.getAllCreatures(), function(creature) {
		context.fillText("C", p + creature.x * gridSize + 20, p + creature.y * gridSize + 25);
	});
	
	context.strokeStyle = "black";
	context.stroke();
  },

  render: function() {
    return (
	  <canvas width={1520} height={1520}/>
    );
  }
});
