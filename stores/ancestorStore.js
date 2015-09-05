var AppDispatcher = require('../appDispatcher.js')
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'new-ancestor'

var AncestorStore = assign({}, EventEmitter.prototype, {

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  
  setAncestor: function(id) {
	  this.ancestor = id;
	  this.emit(CHANGE_EVENT);
  }, 
  
});

AncestorStore.ancestor = null;

AppDispatcher.register(function(action) {
	switch(action.eventName) {
			
		case "select-ancestor":
			AncestorStore.setAncestor(action.creature);
			break;

		default:
      // no op
	} 

 })

module.exports = AncestorStore;