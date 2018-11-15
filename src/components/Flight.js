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
		var good = "#2ed573";
		var ok = "#ffa502";
		var bad = "#d63031";
		var undecided = "#1e90ff";

		var background = null;

		if (this.props.flight.upcoming === false) {
			if (this.props.flight.launchSuccess === true) {
				if (this.props.flight.landIntent === true) {
					if (this.props.flight.landSuccess === true) {
						background = good;
					} else if (this.props.flight.landSuccess === false) {
						background = bad;
					}
				} else if (this.props.flight.landIntent === false) {
					background = ok;	
				}
			} else {
				background = bad;
			}
		} else if (this.props.flight.upcoming === true) {
			background = undecided;
		}

		var style = {
			background: background,
		};

		return (
			<div className="flight">
				<Link to={`/flight/${this.props.flight.num}`} style={{ textDecoration: 'none' }}>
					<div className="top" style={style}>
						<h2>{this.props.flight.num}</h2>
						<h1>{this.props.flight.name}</h1>
						<h3>{this.props.flight.rocketName}</h3>
						<h4>{moment(this.props.flight.udate).format("MMMM Do YYYY, h:mm:ss a")}</h4>
					</div>
				</Link>

				<div className="bottom" style={style}>
					<div className="social-bar">
						{ this.props.flight.reddit 
							?
							<a target="_blank" href={this.props.flight.reddit}>
								<div className="social-item">
									<img src={redditLogo} alt=""/>
								</div>
							</a>
							:
							null
						}

						{ this.props.flight.youtube 
							?
							<a target="_blank" href={this.props.flight.youtube}>
								<div className="social-item">
									<img src={youtubeLogo} alt=""/>
								</div>
							</a>
							:
							null
						}

						{ this.props.flight.wiki 
							?
							<a target="_blank" href={this.props.flight.wiki}>
								<div className="social-item">
									<img src={wikiLogo} alt=""/>
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