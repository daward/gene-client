var AppDispatcher = require('../appDispatcher.js')
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var _ = require('lodash-node');
var Store = require('./store.js')
var RangeFilter = require('../rangeFilter.js');
var BooleanFilter = require('../booleanFilter.js');
var TraitFilter = require('../traitFilter.js');
var Shiva = require('../shiva.js');

var CHANGE_EVENT = 'change-filter'
var RANGE_CHANGE_EVENT = 'change-filter-range'

var FilterStore = assign({}, EventEmitter.prototype, {

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  
  addChangeRangeListener: function(callback) {
    this.on(RANGE_CHANGE_EVENT, callback);
  },

  removeChangeRangeListener: function(callback) {
    this.removeListener(RANGE_CHANGE_EVENT, callback);
  },
  
  setValue: function(name, value) {
	  var filter = _.find(FilterStore.filters, 'name', name);
	  filter.setValue(value)
	  this.emit(CHANGE_EVENT);
  },
  
  updateRanges: function() {
	  _.forEach(FilterStore.filters, function(filter) {
		if(filter.updateMax) {
			filter.updateMax();
		}
	  })
	  this.emit(RANGE_CHANGE_EVENT);
  },
  
  setEnabled: function(indicies) {
	  if(indicies == "all") {
		  _.forEach(FilterStore.filters, function(filter) {
			 filter.enabled = true; 
		  });
	  }
	  
	  else {
		  _.forEach(FilterStore.filters, function(filter) {
			 filter.enabled = false; 
		  });
		  
		 _.forEach(indicies, function(index) {
			FilterStore.filters[index].enabled = true;
		 });		 
	  }
	  
	  this.emit(CHANGE_EVENT);
  },
  
  isVisible: function(creature) {
	  var retVal = true;
	  _.forEach(FilterStore.filters, function(filter) {
		  retVal = retVal && filter.eval(creature);
	  })
	  
	  return retVal;
  },
  
  visibleCreatures : function() {
	  var me = this;
	  return _.filter(Shiva.environment.getAllCreatures(), function(creature) {
		 return  me.isVisible(creature.data);
	  });
  }
  
});	

FilterStore.filters = [];
FilterStore.filters.push(new RangeFilter('Age', 0, 0, 1, false, 
	function(creature) {
		return creature.age <= this.maxValue && creature.age >= this.minValue;
	},
	
	function() {
		return _.max(_.map(Shiva.environment.getAllCreatures(), function(creature) {
			return creature.data.age;
		}))
	}	
));

FilterStore.filters.push(new BooleanFilter('Adults', false, false, function(creature) {
		return creature.isFertile() == this.boolValue;
}));

FilterStore.filters.push(TraitFilter('Intelligence', false));
FilterStore.filters.push(TraitFilter('Size', false));
FilterStore.filters.push(TraitFilter('Fertility', false));
FilterStore.filters.push(TraitFilter('Speed', false));
FilterStore.filters.push(TraitFilter('Prowess', false));



AppDispatcher.register(function(action) {
	switch(action.eventName) {
		case "filter-changed":
			FilterStore.setValue(action.name, action.value);
			break;
			
		case "filters-enabled":
			FilterStore.setEnabled(action.value);
			break;
			
		case "start-year":	
			AppDispatcher.waitFor([Store.dispatchToken]);
			FilterStore.updateRanges()
			break;
		
		default:
      // no op
	} 
 })

module.exports = FilterStore;