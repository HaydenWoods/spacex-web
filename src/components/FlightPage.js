import React, { Component } from 'react';
import axios from "axios";

import redditLogo from '../images/social/reddit.png';
import youtubeLogo from '../images/social/youtube.png';
import wikiLogo from '../images/social/wiki.png';

import './Main.css';
import './FlightPage.css';

class FlightPage extends Component {
	state = {
		flight:{}
	}

	componentDidMount() {
		axios
        .get(`https://api.spacexdata.com/v3/launches/${this.props.match.params.id}`)
        .then(res => {
        	let f = res.data;
        	let flight = {
        		num: f.flight_number,
                name: f.mission_name,
                udate: f.launch_date_local,
                upcoming: f.upcoming,

                rocketName: f.rocket.rocket_name,
                launchSuccess: f.launch_success,
                landIntent: f.rocket.first_stage.cores[0].landing_intent,
                landSuccess: f.rocket.first_stage.cores[0].land_success,

                reddit: f.links.reddit_launch,
                wiki: f.links.wikipedia,
                youtube: f.links.video_link,
        	}

        	this.setState({flight})
        })
        .catch(error => console.log(error));
	}

	render() {
		var good = "#2ed573";
		var ok = "#ffa502";
		var bad = "#d63031";
		var undecided = "#1e90ff";

		var background = null;

		if (this.state.flight.upcoming === false) {
			if (this.state.flight.launchSuccess === true) {
				if (this.state.flight.landIntent === true) {
					if (this.state.flight.landSuccess === true) {
						background = good;
					} else if (this.state.flight.landSuccess === false) {
						background = bad;
					}
				} else if (this.state.flight.landIntent === false) {
					background = ok;	
				}
			} else {
				background = bad;
			}
		} else if (this.state.flight.upcoming === true) {
			background = undecided;
		}

		console.log(background);

		var style = {
			background: background,
		};

		console.log(style);

		return (
			<div className="flightPage">
				<div className="top" style={style}>
					<h1>{this.state.flight.name}</h1>
					<h2>{this.state.flight.rocketName}</h2>
					<h3>{this.state.flight.udate}</h3>
					
					<div className="social-bar">
						{ this.state.flight.reddit 
							?
							<a href={this.state.flight.reddit}>
								<div className="social-item">
									<img src={redditLogo}/>
								</div>
							</a>
							:
							null
						}

						{ this.state.flight.youtube 
							?
							<a href={this.state.flight.youtube}>
								<div className="social-item">
									<img src={youtubeLogo}/>
								</div>
							</a>
							:
							null
						}

						{ this.state.flight.wiki 
							?
							<a href={this.state.flight.wiki}>
								<div className="social-item">
									<img src={wikiLogo}/>
								</div>
							</a>
							:
							null
						}
					</div>
				</div>

				<div className="bottom">

				</div>
			</div>
		)
	}
}

export default FlightPage;