var sorty = require('sorty');
var _ = require('lodash-node');

module.exports.truncate = function(data) {
	return this.truncateByField(data, 'year');
}
  
module.exports.truncateByField = function(data, field) {
	data = sorty({name: field, dir: 'desc', type: 'number'}, data)

	return _.slice(data, 0, 100)
}