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
        advancedSearch: false,
        filters: {
            "reddit": false,
            "wikipedia": false,
            "youtube": false,
            "rocketType": []
        }
    };

    setFilter(e) {
        const filters = this.state.filters
        const value = e.target.checked
        const filtername = e.target.name
        console.log(filtername, value)

        if (filtername.indexOf("rocket:") === 0) {
            if (value) {
                if (filters.rocketType) {
                    filters.rocketType.push(filtername.substring(7))
                } else {
                    filters.rocketType = [filtername.substring(7)]
                }
            } else {
                if (filters.rocketType) {
                    filters.rocketType.splice(filters.rocketType.indexOf(filtername.substring(7)), 1)
                }
            }
        } else {
            filters[filtername] = value
        }
        
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
        if (search == null) {
            search = this.state.search
        }

        const enabledFilters = Object.keys(this.state.filters).filter(filter => {
            const isActive = this.state.filters[filter] === true || (Array.isArray(this.state.filters[filter]) && this.state.filters[filter].length > 0)
            return isActive
        })
        console.log(enabledFilters)

        if (search || (enabledFilters && enabledFilters.length > 0)) {
            console.log("Running search filtering")

            let searchResults 

            searchResults = this.state.flights;

            if (search || this.state.search) {
                console.log("filtering by search")
                searchResults = searchResults.filter((flight, i) => {
                    if (flight.name.toLowerCase().indexOf(search.toLowerCase()) > -1) {
                        return true
                    }
                    if (flight.num.toString() === search) {
                        return true
                    }
                    return false
                });
            }

            console.log(searchResults)

            searchResults = searchResults.filter((flight, i) => {
                const filtersMatched = enabledFilters.filter((filter, i) => {
                    let passed
                    switch (filter) {
                        case 'reddit':
                            passed = flight.reddit
                            break
                        case 'wikipedia':
                            passed = flight.wiki
                            break
                        case 'youtube':
                            passed = flight.youtube
                            break
                        case 'rocketType':
                            passed = this.state.filters.rocketType.includes(flight.rocketName)
                            break
                        default:
                            passed = true
                            break
                    } 

                    return passed
                });

                return enabledFilters.length > 0 ? filtersMatched.length === enabledFilters.length : true
            })

            console.log(searchResults)

            if (search) {
                console.log("is search set")
                this.setState({ search, searchResults })
            } else {
                console.log("is not search set")
                this.setState({ searchResults })
            }
        } else {
            this.setState({ search })
        }
    }

    filterReset(filters) {
        Object.keys(filters).map(f => filters[f] = false)
        console.log(filters)
        return filters
    }

    renderSocialFilters() {
        const { search, searchResults } = this.state
        return (
            <div className="social-filters filters">
                <div className="filter">
                    <input name="reddit" value={this.state.filters.reddit} type="checkbox" onChange={(e) => this.setFilter(e)} disabled={search !== "" && searchResults.filter((flight) => flight.reddit).length === 0} />
                    <label htmlFor="reddit">Reddit</label>
                </div>
                <div className="filter">
                    <input name="youtube" value={this.state.filters.reddit} type="checkbox" onChange={(e) => this.setFilter(e)} disabled={search !== "" && searchResults.filter((flight) => flight.youtube).length === 0} />
                    <label htmlFor="youtube">Youtube</label>
                </div>
                <div className="filter">
                    <input name="wikipedia" value={this.state.filters.wikipedia} type="checkbox" onChange={(e) => this.setFilter(e)} disabled={search !== "" && searchResults.filter((flight) => flight.wiki).length === 0} />
                    <label htmlFor="wikipedia">Wikipedia</label>
                </div>
            </div>
        )
    }

    renderRocketFilters() {
        const {search, searchResults} = this.state
        const rocketTypes = this.state.flights.map((flight) => {
            return flight.rocketName
        })

        return (
            <div className="rocket-filters filters">
                {
                    rocketTypes.filter((type, i) => rocketTypes.indexOf(type) === i).map((type) => {
                        console.log(this.state.filters.rocketType)
                        return (
                            <div className="filter">
                                <input name={`rocket:${type}`} value={this.state.filters.rocketType ? this.state.filters.rocketType.includes(type) : false} type="checkbox" onChange={(e) => this.setFilter(e)} disabled={search !== "" && searchResults.filter((flight) => flight.rocketName === type).length === 0} />
                                <label htmlFor={`rocket:${type}`}>{type}</label>
                            </div>
                        )
                    })
                }
            </div>
        )
        
    }

    render() {
        const { isloading, error, search, searchResults, flights, advancedSearch, filters } = this.state;    
        const enabledFilters = Object.keys(this.state.filters).filter(filter => {
            const isActive = this.state.filters[filter] === true || (Array.isArray(this.state.filters[filter]) && this.state.filters[filter].length > 0)
            return isActive
        })

        const filterOn = enabledFilters.length > 0
        return (
            <div className="main">
                <div className="restrict-1000">
                    <input onChange={ this.handleSearch.bind(this) } className="search" type="text" name="search" placeholder="Search..." autoComplete="off"/>
                    <div className="advanced-search" 
                        onClick={() => {
                            this.setState(
                                {advancedSearch: !this.state.advancedSearch, filters: this.filterReset(filters)}, 
                                () => {
                                    this.handleSearch()
                                }
                            )
                        }}
                    >Advanced Search</div>
                    <div className="advanced-menu" style={{display: advancedSearch ? "block" : "none"}}>
                        { advancedSearch ?
                            <div className="advanced">
                                { this.renderSocialFilters() }
                                { this.renderRocketFilters() }
                            </div> 
                            :
                            null
                        }
                    </div>

                    
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
                            <FlightList flights={ search || filterOn ? searchResults : flights }/>
                        </div>
                    }
                </div> 
            </div>
        );
    }
}

export default Main;
