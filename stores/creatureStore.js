var AppDispatcher = require('../appDispatcher.js')
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var Shiva = require('../shiva.js');
var _ = require('lodash-node');
var Store = require('./store.js')

var CHANGE_EVENT = 'change-creature'
var UPDATE_EVENT = 'update-creature'

var CreatureStore = assign({}, EventEmitter.prototype, {

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
  
  setCreature: function(creature) {
	this.creature = creature;
	this.update();	 
	this.emit(CHANGE_EVENT);
  },
  
  update: function() {
	  var creatureInfo = {}
	  creatureInfo.data = []
	  
	  if(this.creature) {
		  if(Shiva.environment.creatureMap.positions[this.creature]) {
			  var creature = Shiva.environment.creatureMap.positions[this.creature].data
			  _.forOwn(creature, function(value, key) {
				creatureInfo.data.push({'Name' : key, 'Value' : value});
			 });
			 
			 creatureInfo.id = creature.id;
			 
			 creatureInfo.data.push({'Name' : 'MaxEnergy', 'Value' : creature.maxEnergy()});
			 creatureInfo.data.push({'Name' : 'Predation', 'Value' : creature.predationScore()});
			 creatureInfo.data.push({'Name' : 'Nutrition', 'Value' : creature.nutritionRange()[0] + " - " + creature.nutritionRange()[1]});
			 creatureInfo.data.push({'Name' : 'Energy Use', 'Value' : creature.energyUsed()});
			 creatureInfo.data.push({'Name' : 'Range', 'Value' : creature.range()});
			 creatureInfo.data.push({'Name' : 'Intelligence', 'Value' : creature.intelligence()});
			 creatureInfo.data.push({'Name' : 'Size', 'Value' : creature.size()});
		  }
		  else {
			  var id = _.findIndex(this.creatureInfo.data, function(cinfo) {
				  return cinfo.Name == 'dead';
				});
				
			  this.creatureInfo.data[id].Value = "true";
			  creatureInfo = this.creatureInfo;
		  }
	  }
	 
	 this.creatureInfo = creatureInfo;
	 
	this.emit(UPDATE_EVENT);
  },
  
});

CreatureStore.creature = null;
CreatureStore.creatureInfo = {}

AppDispatcher.register(function(action) {
	switch(action.eventName) {
		case "select-creature":
			CreatureStore.setCreature(action.creature);
			break;
			
		case "start-year":	
			AppDispatcher.waitFor([Store.dispatchToken]);
			CreatureStore.update()
			break;
		
		default:
      // no op
	} 
 })

module.exports = CreatureStore;