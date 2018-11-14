import React, { Component } from 'react';

import Flight from "./Flight.js";

import "./Flight.css";

class FlightList extends Component {
  	render() {
  		return (
  			<div className="flightList">
  				{this.props.flights.map(
	    			flight => <Flight key={flight.num} flight={flight}/>
	    		)}
  			</div>
  		)
  	}
}

export default FlightList;