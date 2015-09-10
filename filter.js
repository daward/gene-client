
var Filter = function(name, min, max, increment, enabled, predicate, getMax) {
	this.name = name;
	this.min = min;
	this.max = max;
	this.minValue = min;
	this.maxValue = max;
	this.increment = increment;
	this.enabled = enabled;
	this.predicate = predicate;
	this.getMax = getMax;
}

Filter.prototype.eval = function(creature) {
	return this.predicate == null || !this.enabled || this.predicate(creature);
}

Filter.prototype.updateMax = function() {
	this.max = Math.max(this.maxValue, this.getMax());
}

module.exports = Filter