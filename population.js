var _ = require('lodash-node');
var Trunc = require('./truncate.js')
var Shiva = require('./shiva.js')
var stats = require('stats-lite');

var Population = function(tag, name) {
	this.tag = tag;
	this.ancestorList = [];
	this.geneticData = [];
	this.label = name || tag; 
	this.creatures = [];
}

Population.prototype.computeCreatures = function() {
	var population = this;
	if(population.tag) {
		this.creatures = _.filter(Shiva.environment.getAllCreatures(), function(creature) {
			return creature.data.isMarked([population.tag]);
		});
	} else {
		this.creatures = Shiva.environment.getAllCreatures();
	}
}

Population.prototype.size = function() {
	return this.creatures.length;
}

Population.prototype.name = function() {
	return this.label + " (" + this.size() + ")";
}

Population.prototype.update = function() {
	this.computeCreatures();
	this.computeGenetics();
	this.computeLineage();
}

Population.prototype.computeGenetics = function() {
	var creatures = this.creatures;
	var geneData = {}
	_.forEach(Shiva.settings.traitTypes, function(trait) {
		geneData[trait] = []
		_.forEach(creatures, function(creature) {
			geneData[trait].push(creature.data.traits[trait].value())
		})
	})

	var genes = {}
	_.forEach(Shiva.settings.traitTypes, function(trait) {
		genes[trait] = stats.mean(geneData[trait])
	})
	genes['year'] = Shiva.year;

	this.geneticData.push(genes);
	this.geneticData = Trunc.truncate(this.geneticData);
}

Population.prototype.computeLineage = function() {
  var creatures = this.creatures;
  var ancestors = {}
  var ancestorList = []
  _.forEach(creatures, function(creature) {
	  var ids = _.uniq(_.pluck(creature.data.ancestry, 'id'))
	  _.forEach(ids, function(ancestor) {
		  
		  if(ancestors[ancestor]) {
			ancestors[ancestor]++
		  }
		  else {
			  ancestors[ancestor] = 1
		  }
	  });
  });
  
  _.forIn(ancestors, function(value, key) {
	  ancestorList.push({'ancestor' : key, 'children' : value, percentage : Math.round((value / creatures.length) * 100)})
	});
  
  this.ancestorList = Trunc.truncateByField(ancestorList, 'children');
}

module.exports = Population;