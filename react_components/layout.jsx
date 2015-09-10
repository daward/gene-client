var React = require('react');
var Sidebar = require('react-sidebar');
var RunYear = require('./runyear.jsx');
var Genemap = require('./genemap.jsx')
var DeathStats = require('./deathStats.jsx')
var PopulationSet = require('./populationSet.jsx')
var LocationInfo = require('./locationInfo.jsx')
var CreatureInfo = require('./creatureInfo.jsx')
var Filter = require('./filter.jsx')
var mui = require('material-ui'),
    ThemeManager = new mui.Styles.ThemeManager(),
	Tabs = mui.Tabs,
	Tab = mui.Tab;

var Collapse = require('rc-collapse'),
	Panel = Collapse.Panel;


var Layout = React.createClass({
  getInitialState: function() {
    return {sidebarOpen: true};
  },
  
  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },

  onSetSidebarOpen: function(open) {
    this.setState({sidebarOpen: open});
  },

  render: function() {
    var sidebarContent = 
	<Tabs>
        <Tab label='Death'>
			<DeathStats width={500} height={500}/>
		</Tab>
		<Tab label="Populations">			
				<PopulationSet/>			
		</Tab>
		<Tab label='Location'>			
			<LocationInfo width={500} height={500}/>	
			<CreatureInfo width={500} height={500}/>
		</Tab>
		<Tab label='Filters'>			
			<Filter />
		</Tab>
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
			<Genemap gridSize={21} margin={10}/>
		  </div>
		</div>
      </Sidebar>
    );
  }
});

module.exports = Layout;