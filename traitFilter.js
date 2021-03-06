var Shiva = require('./shiva.js');
var RangeFilter = require('./rangeFilter.js')
var _ = require('lodash-node');

module.exports = function(name, enabled) {
	var getMax = function() {
		return _.max(_.map(Shiva.environment.getAllCreatures(), function(creature) {
			return creature.data.traits[name].value();
		})
		);
	}
	
		
	var predicate = function(creature) {
		var val = creature.traits[name].value()
		return val <= this.maxValue && val >= this.minValue;
	}	
	
	return new RangeFilter(name, 0, 0, .1, enabled, predicate, getMax);
}