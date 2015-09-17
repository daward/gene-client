var RangeFilter = function(name, min, max, increment, enabled, predicate, getMax) {
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

RangeFilter.prototype.eval = function(creature) {
	return this.predicate == null || !this.enabled || this.predicate(creature);
}

RangeFilter.prototype.updateMax = function() {
	this.max = Math.max(this.maxValue, this.getMax());
}

RangeFilter.prototype.setValue = function(value) {
	this.minValue = value[0];
	this.maxValue = value[1];
}

module.exports = RangeFilter