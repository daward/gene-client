var React = require('react');
var Sidebar = require('react-sidebar');
var RunYear = require('./runyear.jsx');
var Genemap = require('./genemap.jsx')
var DeathStats = require('./deathStats.jsx')
var GeneStats = require('./geneStats.jsx')
var LineageStats = require('./lineageStats.jsx')
var LocationInfo = require('./locationInfo.jsx')
var Tabs = require('react-simpletabs');


var Layout = React.createClass({
  getInitialState: function() {
    return {sidebarOpen: true};
  },

  onSetSidebarOpen: function(open) {
    this.setState({sidebarOpen: open});
  },

  render: function() {
    var sidebarContent = 
	<Tabs>
        <Tabs.Panel title='Population'>
			<DeathStats width={500} height={500}/>
			<LineageStats width={500} height={500}/>
		</Tabs.Panel>
		<Tabs.Panel title='Genetics'>			
			<GeneStats width={500} height={500}/>
		</Tabs.Panel>		
		<Tabs.Panel title='Location'>			
			<LocationInfo />
		</Tabs.Panel>
	</Tabs>
	
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
			<Genemap gridSize={30} margin={10}/>
		  </div>
		</div>
      </Sidebar>
    );
  }
});

module.exports = Layout;