import React, { Component } from 'react';
import axios from "axios";
import moment from "moment";

import redditLogo from '../images/social/reddit.png';
import youtubeLogo from '../images/social/youtube.png';
import wikiLogo from '../images/social/wiki.png';

import './Main.css';
import './FlightPage.css';

class FlightPage extends Component {
	state = {
		flight: {},
		isloading: true,
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

                payloadName: f.rocket.second_stage.payloads[0].payload_id,
                payloadType: f.rocket.second_stage.payloads[0].payload_type,
                payloadMass: f.rocket.second_stage.payloads[0].payload_mass_kg,

                reddit: f.links.reddit_launch,
                wiki: f.links.wikipedia,
                youtube: f.links.video_link,
        	}

        	this.setState({flight, isloading: false})
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

		var style = {
			background: background,
		};

		const {isloading, error, flight} = this.state;    

		return (
            <div className="flightPage">
            	{ isloading ?
	                <div className="loader"></div>
	                :
	                null
	            }

	            { error && !isloading ?  
	                <div className="error">
	                    { error }
	                </div>
	                :
	                null
	            }

	            { !error && !isloading ?
	            	<div className="container">
		                <div className="top" style={style}>
							<h1>{flight.name}</h1>
							<h2>{flight.rocketName}</h2>
							<h3>{moment(flight.udate).format("MMMM Do YYYY, h:mm:ss a")}</h3>
							<div className="social-bar">
								{ flight.reddit 
									?
									<a target="_blank" rel="noopener noreferrer" href={flight.reddit}>
										<div className="social-item">
											<img src={redditLogo} alt=""/>
										</div>
									</a>
									:
									null
								}

								{ flight.youtube 
									?
									<a target="_blank" rel="noopener noreferrer" href={flight.youtube}>
										<div className="social-item">
											<img src={youtubeLogo} alt=""/>
										</div>
									</a>
									:
									null
								}

								{ flight.wiki 
									?
									<a target="_blank" rel="noopener noreferrer" href={flight.wiki}>
										<div className="social-item">
											<img src={wikiLogo} alt=""/>
										</div>
									</a>
									:
									null
								}
							</div>
						</div>
						<div className="restrict-1000">
							<div className="bottom">
								{ flight.payloadName
									?
									<div className="content-box">
										<h1>Payload Data</h1>
										<ul>
											<li>Payload Name: { flight.payloadName }</li>
											<li>Payload Type: { flight.payloadType }</li>
											<li>Payload Mass: { flight.payloadMass }kg</li>
										</ul>
									</div>
									:
									null
								}
							</div>
						</div>
					</div>
					:
					null
	            }
			</div>
		)
	}
}

export default FlightPage;
