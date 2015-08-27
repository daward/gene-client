var React = require('react');
var Sidebar = require('react-sidebar');
var RunYear = require('./runyear.jsx');
var Genemap = require('./genemap.jsx')
var DeathStats = require('./deathStats.jsx')
var GeneStats = require('./geneStats.jsx')


var Layout = React.createClass({
  getInitialState: function() {
    return {sidebarOpen: true};
  },

  onSetSidebarOpen: function(open) {
    this.setState({sidebarOpen: open});
  },

  render: function() {
    var sidebarContent = 
	<div>
		<DeathStats width={500} height={500}/>;
		<GeneStats width={500} height={500}/>
	</div>
	
    return (
      <Sidebar sidebar={sidebarContent}
               open={this.state.sidebarOpen}
               onSetOpen={this.onSetSidebarOpen}
			   docked={true}>
        <div>
		  <div>
			<RunYear />
		  </div>
		  <div>
			<Genemap />
		  </div>
		</div>
      </Sidebar>
    );
  }
});

module.exports = Layout;