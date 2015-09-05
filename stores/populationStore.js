var AppDispatcher = require('../appDispatcher.js')
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var _ = require('lodash-node');
var stats = require("stats-lite")

var Shiva = require('../shiva.js');
var Population = require('../population.js')
var Store = require('./store.js')

var CHANGE_EVENT = 'add-population'
var UPDATE_EVENT = 'update-population'

var PopulationStore = assign({}, EventEmitter.prototype, {

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
  
  createSubPopulation: function(id) {
	  Shiva.environment.creatureMap.positions[id].data.markers.push(id);
	  var population = new Population(id);
	  population.update();
	  PopulationStore.populations.push(population);
	  this.emit(CHANGE_EVENT);
  },
  
  createAncestorPopulation: function(id) {
	  
	  _.forEach(Shiva.environment.getAllCreatures(), function(creature) {
		if(_.find(creature.data.ancestry, function(anc) { return anc.id == id})) {
			creature.data.markers.push(id);
		}
	  });	  
	  
	  var population = new Population(id, "ancestor - " + id);
	  population.update();
	  PopulationStore.populations.push(population);
	  this.emit(CHANGE_EVENT);
  },
  
  update : function() {
	  _.forEach(PopulationStore.populations, function(population) {
		  population.update();
	  });
	  
	  var inactives = _.remove(PopulationStore.populations, function(population) {
		  return population.size() == 0 || 
			(population.size() == PopulationStore.populations[0].size() && population.tag != null)
	  });
	  PopulationStore.inactivePopulations = PopulationStore.inactivePopulations.concat(inactives);
	  PopulationStore.emit(UPDATE_EVENT);
  }  
});

var rootPopulation = new Population(null, "Global Population");
rootPopulation.update();
PopulationStore.populations = [rootPopulation];
PopulationStore.inactivePopulations = [];

AppDispatcher.register(function(action) {
	switch(action.eventName) {
		case "create-marker":
			PopulationStore.createSubPopulation(action.creature);			
			break;
			
		case "create-ancestor-marker":
			PopulationStore.createAncestorPopulation(action.creature);			
			break;
			
		case "start-year":	
			AppDispatcher.waitFor([Store.dispatchToken]);
			PopulationStore.update()
			break;
		
		default:
      // no op
	} 
 })

module.exports = PopulationStore;