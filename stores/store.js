var AppDispatcher = require('../appDispatcher.js')
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var _ = require('lodash-node');
var Shiva = require('../shiva.js');
var Trunc = require('../truncate.js');

var CHANGE_EVENT = 'new-year'
var CHANGE_CREATURE = 'new-creature'
var CHANGE_ANCESTOR = 'new-ancestor'

var Store = assign({}, EventEmitter.prototype, {

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  
  runYear: function() {
	Shiva.increment();
	this.update();
	this.emit(CHANGE_EVENT);	
  },
  
  update: function() {
	  Store.populationData.push({
		year : Shiva.year, 
		starved : Shiva.environment.deathReasons["starvation"], 
		'old age': Shiva.environment.deathReasons["old age"], 
		eaten: Shiva.environment.deathReasons["eaten"],
		alive: Shiva.environment.getAllCreatures().length}
	);
	
	Store.poulationData = Trunc.truncate(Store.populationData)	
  },	
  
});

Store.running = false;
Store.populationData = [];

Store.dispatchToken = AppDispatcher.register(function(action) {
	switch(action.eventName) {
		case "start-year":
			Store.runYear();
			keepRunning();
			break;
			
		case "start-continuous":
			Store.running = true;
			keepRunning();
			break;
			
		case "stop-continuous":
			Store.running = false;
			break;

		default:
      // no op
	} 

 })
 
 function keepRunning() {
	setTimeout(function(){				
		if(Store.running) {
			AppDispatcher.dispatch({
				eventName: 'start-year',
			});
		}
	}, 50);	
 }

module.exports = Store;