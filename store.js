var AppDispatcher = require('./appDispatcher.js')
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var Gene = require('gene-sim');
var _ = require('lodash-node');
var stats = require("stats-lite")
var EnvironmentStats = require("./environmentStats.js")

var CHANGE_EVENT = 'new-year'
var CHANGE_LOCATION = 'new-location'
var CHANGE_CREATURE = 'new-creature'
var CHANGE_ANCESTOR = 'new-ancestor'

var Store = assign({}, EventEmitter.prototype, {

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  
  addChangeAncestorListener: function(callback) {
    this.on(CHANGE_ANCESTOR, callback);
  },
  
  removeChangeAncestorListener: function(callback) {
    this.removeListener(CHANGE_ANCESTOR, callback);
  },
  
  addChangeLocationListener: function(callback) {
	 this.on(CHANGE_EVENT, callback);
	 this.on(CHANGE_LOCATION, callback);
  },
  
  removeChangeLocationListener: function(callback) {
	 this.removeListener(CHANGE_EVENT, callback);
	 this.removeListener(CHANGE_LOCATION, callback);
  },
  
  addChangeCreatureListener: function(callback) {
	 this.on(CHANGE_EVENT, callback);
	 this.on(CHANGE_CREATURE, callback);
  },
  
  removeChangeCreatureListener: function(callback) {
	  this.removeListener(CHANGE_EVENT, callback);
	  this.removeListener(CHANGE_CREATURE, callback);;
  },
  
  runYear: function() {
	this.god.observeTheWorldIHaveCreated();
	EnvironmentStats.compute(this.god.environment);
	this.emit(CHANGE_EVENT);
  },
  
  setLocation: function(x, y) {
	  EnvironmentStats.x = x;
	  EnvironmentStats.y = y;
	  EnvironmentStats.computeLocation(this.god.environment);
	  this.emit(CHANGE_LOCATION);
  },
  
  setAncestor: function(id) {
	  this.ancestor = id;
	  this.emit(CHANGE_ANCESTOR);
  },
  
  setCreature: function(creature) {
	  EnvironmentStats.creature = creature;
	  Store.creature = creature;
	  EnvironmentStats.computeCreature(this.god.environment);
	  this.emit(CHANGE_CREATURE);
  }
  
});

Store.god = new Gene.God();
Store.god.createTheWorld();
Store.settings = Gene.Settings;
Store.running = false;
Store.ancestor = null;
Store.creature = null;

AppDispatcher.register(function(action) {
	switch(action.eventName) {
		case "start-year":
			Store.runYear();			
			break;
			
		case "start-continuous":
			Store.runYear();
			Store.running = true;
			setTimeout(function(){				
				if(Store.running) {
					AppDispatcher.dispatch({
						eventName: 'start-continuous',
					});
				}
			}, 100);
			break;
			
		case "stop-continuous":
			Store.running = false;
			break;
			
		case "location-changed":
			Store.setLocation(action.x, action.y);
			break;
			
		case "select-creature":
			Store.setCreature(action.creature);
			break;
			
		case "select-ancestor":
			Store.setAncestor(action.creature);
			break;

		default:
      // no op
	} 

 })

module.exports = Store;