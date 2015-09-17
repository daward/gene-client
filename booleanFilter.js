var BooleanFilter = function(name, defaultValue, enabled, predicate) {
	this.name = name;
	this.boolValue = defaultValue;
	this.enabled = enabled;
	this.predicate = predicate;
}

BooleanFilter.prototype.eval = function(creature) {
	return this.predicate == null || !this.enabled || this.predicate(creature);
}

BooleanFilter.prototype.setValue = function(value) {
	this.boolValue = value;
}


module.exports = BooleanFilter