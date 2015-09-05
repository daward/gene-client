var AppDispatcher = require('../appDispatcher.js')
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var Shiva = require('../shiva.js');
var _ = require('lodash-node');
var Store = require('./store.js')

var CHANGE_EVENT = 'change-location'
var UPDATE_EVENT = 'update-location'

var LocationStore = assign({}, EventEmitter.prototype, {

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  
  addUpdateListener: function(callback) {
    this.on(UPDATE_EVENT, callback);
  },

  removeUpdateListener: function(callback) {
    this.removeListener(UPDATE_EVENT, callback);
  },
  
  setLocation: function(x, y) {
	  this.x = x;
	  this.y = y;
	  this.update();
	  this.emit(CHANGE_EVENT);
  },
  
  update: function() {
	  var locationInfo = []
	  locationInfo.push({'Name' : 'x', 'Value' : LocationStore.x});
	  locationInfo.push({'Name' : 'y', 'Value' : LocationStore.y});
	  
	  var vegetation = Shiva.environment.vegetationMap.get(LocationStore.x, LocationStore.y)[0]
	  _.forOwn(vegetation, function(value, key) {
		locationInfo.push({'Name' : key, 'Value' : value});
	 });
	 
	 _.forEach(Shiva.environment.creatureMap.get(LocationStore.x, LocationStore.y), function(creature) {
		 locationInfo.push({'Name' : 'creature', 'Value' : creature.id});
	 });
	 
	 this.locationInfo = locationInfo
	 this.emit(UPDATE_EVENT);
  },
  
});

LocationStore.x = 0;
LocationStore.y = 0;
LocationStore.locationInfo = [];

AppDispatcher.register(function(action) {
	switch(action.eventName) {
		case "location-changed":
			LocationStore.setLocation(action.x, action.y);
			break;
			
		case "start-year":	
			AppDispatcher.waitFor([Store.dispatchToken]);
			LocationStore.update()
			break;
		
		default:
      // no op
	} 
 })

module.exports = LocationStore;