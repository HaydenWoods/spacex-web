import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import moment from "moment";

import redditLogo from '../images/social/reddit.png';
import youtubeLogo from '../images/social/youtube.png';
import wikiLogo from '../images/social/wiki.png';

import './Main.css';
import "./Flight.css";

class Flight extends Component {
	render() {
		const flight = this.props.flight;

		var good = "#2ed573";
		//var ok = "#ffa502";
		var bad = "#d63031";
		var undecided = "#1e90ff";

		var background = undecided;

		//Flight launched colour
		if (flight.launchSuccess === true) {
			background = good;
		} else if (flight.launchSuccess === false) {
			background = bad;
		}

		var style = {
			background: background,
		};

		return (
			<div className="flight">
				<Link to={`/flight/${flight.num}`} style={{ textDecoration: 'none' }}>
					<div className="top" style={ style }>
						<h2>
							{ flight.num }
							{ flight.landSuccess ?
								" - Landed!"
								:
								null
							}
						</h2>
						<h1>{ flight.name }</h1>
						<h3>{ flight.rocketName }</h3>
						<h4>{ moment(flight.udate).format("MMMM Do YYYY, h:mm:ss a") }</h4>
					</div>
				</Link>

				<div className="bottom" style={ style }>
					<div className="social-bar">
						{ flight.reddit ?
							<a target="_blank" rel="noopener noreferrer" href={ flight.reddit }>
								<div className="social-item">
									<img src={ redditLogo } alt=""/>
								</div>
							</a>
							:
							null
						}

						{ flight.youtube ?
							<a target="_blank" rel="noopener noreferrer" href={ flight.youtube }>
								<div className="social-item">
									<img src={ youtubeLogo } alt=""/>
								</div>
							</a>
							:
							null
						}

						{ flight.wiki ?
							<a target="_blank" rel="noopener noreferrer" href={ flight.wiki }>
								<div className="social-item">
									<img src={ wikiLogo } alt=""/>
								</div>
							</a>
							:
							null
						}
					</div>
				</div>
			</div>
		)
	}
}

export default Flight;