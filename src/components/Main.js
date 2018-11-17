import React, { Component } from 'react';
import axios from "axios";
import FlightList from "./FlightList.js";
import moment from "moment";
import $ from "jquery";

import './Main.css';

$(document).ready(function() {
    $(".advanced-search").click(function() {
        if ($(".advanced-menu").css("height") === "200px") {
            $(".advanced-menu").animate({
                height: "0px",
            },100);
        } else {
            $(".advanced-menu").animate({
                height: "200px",
            },100);
        }
    });
});

class Main extends Component {
    state = {
        flights: [],
        search: "",
        searchResults: [],
        isloading: true,
        advancedSearch: true,
        filters: {
            "reddit": false
        }
    };

    setFilter(e) {
        const filters = this.state.filters
        const value = e.target.checked
        const filtername = e.target.name
        console.log(filtername, value)
        filters[filtername] = value
        this.setState({filters})
        this.handleSearch(null)
    }

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

                    rocketId: f.rocket.rocket_id,
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

            this.setState({ flights, isloading: false });
        })
        .catch(error => this.setState({ error }));
    }

    handleSearch(e) {
        let search
        if (e) {
            search = e.target.value;
        }

        if (search || Object.keys(this.state.filters).filter(filter => this.state.filters[filter] === true).length > 0) {
            let searchResults 
            searchResults = this.state.flights.filter((flight, i) => {
                if (search) {
                    if (flight.name.toLowerCase().indexOf(search.toLowerCase()) > -1) {
                        return true
                    }
                    if (flight.num.toString() === search) {
                        return true
                    }
                }

                let filterStatus = Object.keys(this.state.filters).filter((filter, i) => {
                    const filtervalue = this.state.filters[filter]
                    if (filtervalue) {
                        let ret
                        switch (filter) {
                            case 'reddit':
                                ret = flight.reddit !== null
                                break
                            default:
                                break
                        }
                        return ret
                    } else {
                        return false
                    }
                }).length > 0

                console.log(filterStatus)

                return filterStatus
            })

            console.log(searchResults)

            if (search) {
                this.setState({ search, searchResults })
            } else {
                console.log("here")
                this.setState({ searchResults })
            }
        } else {
            this.setState({ search })
        }
    }

    render() {
        const { isloading, error, search, searchResults, flights, advancedSearch } = this.state;    
        return (
            <div className="main">
                <div className="restrict-1000">
                    <input onChange={ this.handleSearch.bind(this) } className="search" type="text" name="search" placeholder="Search..." autoComplete="off"/>
                    { advancedSearch ?
                        <div className="advanced">
                            <label htmlFor="reddit">Reddit</label>
                            <input name="reddit" value={this.state.filters.reddit} type="checkbox" onChange={(e) => this.setFilter(e)} disabled={search !== "" && searchResults.filter((flight) => flight.reddit).length === 0} />
                        </div> 
                        :
                        null
                    }
                    { search.length > 0 ?
                        <div className="search-results">{`${searchResults.length} Result${searchResults.length !== 1 ? "s" : ""}`}</div>
                        :
                        null
                    }
                    { isloading ?  
                        <div className="loader"></div>
                        :
                        null
                    }
                    { error && !isloading ?  
                        <div className="error">{ this.state.error }</div>
                        :
                        <div className="container">
                            <FlightList flights={ search ? searchResults : flights }/>
                        </div>
                    }
                </div> 
            </div>
        );
    }
}

export default Main;
