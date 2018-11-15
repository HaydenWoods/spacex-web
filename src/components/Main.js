import React, { Component } from 'react';
import axios from "axios";
import FlightList from "./FlightList.js";

import './Main.css';

class Main extends Component {
    state = {
        flights: [],
        search: "",
        searchResults: [],
        isloading: true,
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

            this.setState({flights, isloading: false});
        })
        .catch(error => this.setState({error}));
    }

    handleSearch(e) {
        const search = e.target.value;
        if (search) {
            const searchResults = this.state.flights.filter((flight, i) => {
                console.log(flight.name)
                if (flight.name.toLowerCase().indexOf(search.toLowerCase()) > -1) {
                    return true
                } 

                if (flight.num.toString() === search) {
                    return true
                }

                return false
            })
            this.setState({search, searchResults})
        } else {
            this.setState({search})
        }
    }

    render() {
        const {isloading, error, search, searchResults, flights} = this.state;    
        return (
            <div className="restrict-1000">
                <div className="main">
                    <input onChange={this.handleSearch.bind(this)} className="search" type="text" name="search" placeholder="Search..." autoComplete="off"/>
                    { isloading ?  
                        <div className="loading">
                            Loading...
                        </div>
                        :
                        null
                    }
                    { error && !isloading ?  
                        <div className="error">
                            {this.state.error}
                        </div>
                        :
                        <FlightList flights={search ? searchResults : flights}/>
                    }
                </div>
            </div>
        );
    }
}

export default Main;
