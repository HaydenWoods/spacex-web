import React, { Component } from 'react';
import axios from "axios";
import FlightList from "./FlightList.js";

import './Main.css';

class Main extends Component {
    state = {
        flights: []
    };

    componentDidMount() {
        axios
        .get("https://api.spacexdata.com/v3/launches")
        .then(response => {
            const flights = response.data.map(f => {
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
                };

                return flight
            });

            this.setState({flights});
        })
        .catch(error => console.log(error));
    }

    render() {
        return (
            <div className="restrict-1000">
                <div className="main">
                    <FlightList flights={this.state.flights}/>
                </div>
            </div>
        );
    }
}

export default Main;
