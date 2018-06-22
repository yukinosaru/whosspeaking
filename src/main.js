// React imports - Material UI //
import React from 'react';
import ReactDOM from 'react-dom';

// Material-components-web
import 'material-components-web/dist/material-components-web.min.css';

// RMWC components
import {
  TopAppBar,
  TopAppBarRow,
  TopAppBarSection,
  TopAppBarNavigationIcon,
  TopAppBarActionItem,
  TopAppBarTitle,
  TopAppBarFixedAdjust
} from 'rmwc/TopAppBar';
import { Theme } from 'rmwc/Theme';
import { Grid, GridCell } from 'rmwc/Grid';
import {
  Card,
  CardPrimaryAction,
  CardActions,
  CardMedia,
  CardMediaContent,
} from 'rmwc/Card';
import { Typography } from 'rmwc/Typography';
import { TextField } from 'rmwc/TextField';

(function() {
  'use strict';
// *** START SERVICE WORKER CODE *** //
// Check to make sure service workers are supported in the current browser,
// and that the current page is accessed from a secure origin. Using a
// service worker from an insecure origin will trigger JS console errors. See
// http://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features
var isLocalhost = Boolean(window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
  );

if ('serviceWorker' in navigator &&
    (window.location.protocol === 'https:' || isLocalhost)) {
  navigator.serviceWorker.register('service-worker.js')
  .then(function(registration) {
    // updatefound is fired if service-worker.js changes.
    registration.onupdatefound = function() {
      // updatefound is also fired the very first time the SW is installed,
      // and there's no need to prompt for a reload at that point.
      // So check here to see if the page is already controlled,
      // i.e. whether there's an existing service worker.
      if (navigator.serviceWorker.controller) {
        // The updatefound event implies that registration.installing is set:
        // https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-container-updatefound-event
        var installingWorker = registration.installing;

        installingWorker.onstatechange = function() {
          switch (installingWorker.state) {
            case 'installed':
              // At this point, the old content will have been purged and the
              // fresh content will have been added to the cache.
              // It's the perfect time to display a "New content is
              // available; please refresh." message in the page's interface.
              break;

            case 'redundant':
              throw new Error('The installing ' +
                              'service worker became redundant.');

            default:
              // Ignore
          }
        };
      }
    };
  }).catch(function(e) {
    console.error('Error during service worker registration:', e);
  });
}
// *** END SERVICE WORKER CODE *** //

// REACT components

// Timer Button
class TimerButton extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			seconds: 0,
			minutes: 0,
			hours: 0,
		};
		this.setTime = this.setTime.bind(this);
		this.add = this.add.bind(this);
	}

	setTime(seconds, minutes, hours){
		this.setState({
			seconds: seconds,
			minutes: minutes,
			hours: hours,
		});
	}
	add(){
		var seconds = this.state.seconds;
		var minutes = this.state.minutes;
		var hours = this.state.hours;
		seconds++;
		if (seconds >= 60) {
			seconds =0;
			minutes++;
			if (minutes >=60) {
				minutes = 0;
				hours++;
			}
		}
		this.setTime(seconds,minutes,hours);
	}

	componentWillReceiveProps(nextProps){
		if (nextProps.isRunning == true && this.props.isRunning == false) {
			var varTimer = setInterval(this.add,1000);
			this.setState({ varTimer: varTimer}); 
		} else if (nextProps.isRunning == false && this.props.isRunning == true) {
			clearInterval(this.state.varTimer);
		}
	}

	render(){
		var use;
		this.props.isRunning ? use = 'primary-bg on-primary' : use = 'text-disabled-on-background';
		
		var seconds = this.state.seconds;
		var minutes = this.state.minutes;
		var hours = this.state.hours;
		var textTime = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds ? (seconds > 9 ? seconds : "0" + seconds) : "00");
		return(
			<Theme use={ use }>
				<CardPrimaryAction onClick={()=> this.props.handleToggle(this.props.id)}>
					<CardMedia
						sixteenByNine
					>
				    	<CardMediaContent>
				    		<Typography
				    			use="headline5"
				    			tag="div"
				    			style={{
				    				textAlign: 'center',
						            bottom: '0',
						            left: '0',
						            right: '0',
						            position: 'absolute'
				    			}}
							>
					            {textTime}
							</Typography>
						</CardMediaContent>
				    </CardMedia>
				</CardPrimaryAction>
			</Theme>    
		);
	}
}

// Label
class Label extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			name: ""
		}
		this.handleNameChange = this.handleNameChange.bind(this);
	}

	handleNameChange(event){
		this.setState({name: event.target.value} );
	}

	render(){
		return(
			<CardActions>
				<TextField
					onChange={this.handleNameChange}
					placeholder="Label me..." 
					value={this.state.name}
					dense
	        	/>
	        </CardActions>
		);
	}
}

// Timer
class Timer extends React.Component {
	constructor(props){
		super(props)
		
		this.handleToggle = this.handleToggle.bind(this);
	}

	handleToggle(id){
		this.props.isRunning == true ? this.props.setTimer(null) : this.props.setTimer(this.props.id);
	}

	render(){
		return(
			<Card>  
				<TimerButton isRunning={ this.props.isRunning } handleToggle={ this.handleToggle } />
				<Label />
			</Card>
		);
	}
}

// App
class App extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			drawerIsOpen: false,
			timerRunning: "",
		};
		// Could put timer names into an array here.
		this.setTimerStatus = this.setTimerStatus.bind(this);
	}

	setTimerStatus(timer){
		this.setState( {timerRunning: timer} );
	}

	render(){
		// Could dynamically generate timers based on array in state.
		return(
			<div>
				<TopAppBar fixed>
				  <TopAppBarRow>
				    <TopAppBarSection>
				      <TopAppBarNavigationIcon use="menu" />
				      <TopAppBarTitle>Who's Speaking</TopAppBarTitle>
				    </TopAppBarSection>
				  </TopAppBarRow>
				</TopAppBar>
				<TopAppBarFixedAdjust />
				<Grid style={{ backgroundColor: '#eee' }}>
					<GridCell span="2">
						<Timer id="one" setTimer={this.setTimerStatus} isRunning={this.state.timerRunning == "one" ? true : false } />
					</GridCell>
					<GridCell span="2">
						<Timer id="two" setTimer={this.setTimerStatus} isRunning={this.state.timerRunning == "two" ? true : false } />
					</GridCell>
					<GridCell span="2">
						<Timer id="three" setTimer={this.setTimerStatus} isRunning={this.state.timerRunning == "three" ? true : false } />
					</GridCell>
					<GridCell span="2">
						<Timer id="four" setTimer={this.setTimerStatus} isRunning={this.state.timerRunning == "four" ? true : false } />
					</GridCell>
					<GridCell span="2">
						<Timer id="five" setTimer={this.setTimerStatus} isRunning={this.state.timerRunning == "five" ? true : false } />
					</GridCell>
					<GridCell span="2">
						<Timer id="six" setTimer={this.setTimerStatus} isRunning={this.state.timerRunning == "six" ? true : false } />
					</GridCell>
				</Grid>
			</div>
		);
	}
}

ReactDOM.render(
  <App />,
  document.getElementById('mainContent')
);

})();
