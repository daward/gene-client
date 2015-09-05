var Gene = require('gene-sim');

var shiva = new Gene.God()
shiva.createTheWorld();
shiva.settings = Gene.Settings;
shiva.year = 0;

shiva.increment = function() {
	this.observeTheWorldIHaveCreated();
	shiva.year++;
}

module.exports = shiva;