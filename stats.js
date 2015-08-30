
var _ = require('lodash-node');
var sorty = require('sorty');
var Gene = require('gene-sim');
var stats = require("stats-lite")

var Stats = function() {
	
	computePopulation: function(environment) {
	  this.populationData.push({
		year : year, 
		starved : environment.deathReasons["starvation"], 
		'old age': environment.deathReasons["old age"], 
		eaten: environment.deathReasons["eaten"],
		alive: environment.getAllCreatures().length}
	);
	
	this.poulationData = this.truncate(this.populationData)	
  },
  
  computeLineage: function(environment) {
	  var creatures = environment.getAllCreatures();
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
	  
	  this.ancestorList = this.truncateByField(ancestorList, 'children');
  },
  
  computeGenetics: function(environment) {
	var creatures = environment.getAllCreatures();
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
	this.geneticData = this.truncate(this.geneticData);
  },	
  
  truncate: function(data) {
	 return this.truncateByField(data, 'year');
  },
  
  truncateByField: function(data, field) {
	data = sorty({name: field, dir: 'desc', type: 'number'}, data)
	
	return _.slice(data, 0, 100)
  }
}  

var stats = new Stats();
stats.populationData = [];
stats.geneticData = [];
stats.year = 0;

module.exports = stats;