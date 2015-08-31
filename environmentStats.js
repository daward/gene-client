var _ = require('lodash-node');
var sorty = require('sorty');
var Gene = require('gene-sim');
var stats = require("stats-lite")

var EnvironmentStats = {
	
	computePopulation: function(environment) {
	  this.populationData.push({
		year : this.year, 
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
  
  computeLocation: function(environment) {
	  var locationInfo = []
	  locationInfo.push({'Name' : 'x', 'Value' : EnvironmentStats.x});
	  locationInfo.push({'Name' : 'y', 'Value' : EnvironmentStats.y});
	  
	  var vegetation = environment.vegetationMap.get(this.x, this.y)[0]
	  _.forOwn(vegetation, function(value, key) {
		locationInfo.push({'Name' : key, 'Value' : value});
	 });
	 
	 _.forEach(environment.creatureMap.get(this.x, this.y), function(creature) {
		 locationInfo.push({'Name' : 'creature', 'Value' : creature.id});
	 });
	 
	 this.locationInfo = locationInfo
  },
  
  computeCreature: function(environment) {
	  var creatureInfo = []
	  
	  if(EnvironmentStats.creature) {
		  if(environment.creatureMap.positions[EnvironmentStats.creature]) {
			  var creature = environment.creatureMap.positions[EnvironmentStats.creature].data
			  _.forOwn(creature, function(value, key) {
				creatureInfo.push({'Name' : key, 'Value' : value});
			 });
			 
			 creatureInfo.push({'Name' : 'MaxEnergy', 'Value' : creature.maxEnergy()});
			 creatureInfo.push({'Name' : 'Predation', 'Value' : creature.predationScore()});
			 creatureInfo.push({'Name' : 'Nutrition', 'Value' : creature.nutritionRange()[0] + " - " + creature.nutritionRange()[1]});
			 creatureInfo.push({'Name' : 'Energy Use', 'Value' : creature.energyUsed()});
			 creatureInfo.push({'Name' : 'Range', 'Value' : creature.range()});
			 creatureInfo.push({'Name' : 'Intelligence', 'Value' : creature.intelligence()});
			 creatureInfo.push({'Name' : 'Size', 'Value' : creature.size()});
			 
		  }
		  else {
			  var id = _.findIndex(this.creatureInfo, function(cinfo) {
				  return cinfo.Name == 'dead';
				});
				
			  this.creatureInfo[id].Value = "true";
			  creatureInfo = this.creatureInfo;
		  }
	  }
	 
	 this.creatureInfo = creatureInfo
  },
  
  compute: function(environment) {
	
    this.year = this.year + 1;
	this.computePopulation(environment);
	this.computeGenetics(environment);		
	this.computeLineage(environment);
	this.computeLocation(environment);
	this.computeCreature(environment);
  },
  
  truncate: function(data) {
	 return this.truncateByField(data, 'year');
  },
  
  truncateByField: function(data, field) {
	data = sorty({name: field, dir: 'desc', type: 'number'}, data)
	
	return _.slice(data, 0, 100)
  }
};

EnvironmentStats.populationData = [];
EnvironmentStats.geneticData = [];
EnvironmentStats.ancestorList = [];
EnvironmentStats.locationInfo = [];
EnvironmentStats.creatureInfo = [];
EnvironmentStats.year = 0;
EnvironmentStats.x = 0;
EnvironmentStats.y = 0;
EnvironmentStats.creature;

module.exports = EnvironmentStats;