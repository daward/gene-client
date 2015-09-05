var AppDispatcher = require('../appDispatcher.js')
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var _ = require('lodash-node');
var Shiva = require('../shiva.js');
var Trunc = require('../truncate.js');

var CHANGE_EVENT = 'new-view'

var VegetationStore = assign({}, EventEmitter.prototype, {

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  
  getDensity: function(vegetation) {
	  var value, max;
	  switch(VegetationStore.viewType) {
		case "size":
			max = Shiva.maxSize * Shiva.maxSizeMultiplier;
			value = vegetation.size;
			break;
		  
		case "energy":
			max = Shiva.maxEnergy;
			value = vegetation.energyProvided;
			break;
			
		case "nutrition":
			max = Shiva.maxNutrition - Shiva.minNutrition;
			value = vegetation.nutrition - Shiva.minNutrition;
			break;
	  }
	  
	  return (value / max );
  }
});

VegetationStore.viewType = "size";

VegetationStore.dispatchToken = AppDispatcher.register(function(action) {
	switch(action.eventName) {
		case "vegetation-view-change":
			VegetationStore.viewType = action.viewType;
			VegetationStore.emit(CHANGE_EVENT);
			break;

	} 

 })


module.exports = VegetationStore;