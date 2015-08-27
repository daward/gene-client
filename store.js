var AppDispatcher = require('./appDispatcher.js')
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var Gene = require('gene-sim');
var _ = require('lodash-node');
var stats = require("stats-lite")

var CHANGE_EVENT = 'new-year'

var Store = assign({}, EventEmitter.prototype, {
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  
  compute: function() {
	
    this.year = this.year + 1;
	this.populationData.push({
		year : this.year, 
		starved : this.god.environment.deathReasons["starvation"], 
		'old age': this.god.environment.deathReasons["old age"], 
		eaten: this.god.environment.deathReasons["eaten"],
		alive: this.god.environment.getAllCreatures().length}
	);
	
	var creatures = this.god.environment.getAllCreatures();
	var geneData = {}
	_.forEach(Gene.Settings.traitTypes, function(trait) {
		geneData[trait] = []
		_.forEach(creatures, function(creature) {
			geneData[trait].push(creature.data.traits[trait].value())
		})
	})
	
	
	var genes = {}
	_.forEach(Gene.Settings.traitTypes, function(trait) {
		genes[trait] = stats.mean(geneData[trait])
	})
	genes['year'] = this.year;
	
	this.geneticData.push(genes);
		
  },
});

Store.god = new Gene.God();
Store.god.createTheWorld();
Store.settings = Gene.Settings; 
Store.year = 0;
Store.populationData = [];
Store.geneticData = [];

AppDispatcher.register(function(action) {
	switch(action.eventName) {
		case "start-year":
			Store.god.observeTheWorldIHaveCreated();
			Store.compute();
			Store.emitChange();
			break;

		default:
      // no op
	} 

 })

module.exports = Store;