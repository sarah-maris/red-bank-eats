import React, { Component } from 'react';
import scriptLoader from 'react-async-script-loader';
import { mapStyles } from './data/mapStyles.js';
import './App.css';
import ListView from './ListView'
import spinner from './images/circles-loader.svg';
import foursquare from './images/foursquare.png';

class App extends Component {

  state = {
    listOpen: true,
    map: {},
    infowindow: {},
    bounds: {},
    mapReady: false,
    // future use - location search
    mapCenter : { lat: 40.346074, lng: -74.067858 }
  }



  componentWillReceiveProps({isScriptLoadSucceed}){

    // Check if script is loaded and if map is defined
    if (isScriptLoadSucceed && !this.state.mapReady ) {

      // create map
      const map = new window.google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: this.state.mapCenter,
        styles: mapStyles
      });

      // set up bounds and infowindow to use later
      const bounds = new window.google.maps.LatLngBounds();
      const infowindow = new window.google.maps.InfoWindow();

      this.setState({
        map: map,
        infowindow: infowindow,
        bounds: bounds,
        mapReady: true,
      });

    // alert user if map request fails
    } else if ( !this.state.mapReady ) {
      alert("Map did not load");
    }
  }

  toggleList = () => {
    this.setState( { listOpen: !this.state.listOpen})
  }

  render() {

    const { listOpen, map, infowindow, bounds, mapReady, mapCenter } = this.state;

    return (
      <div className="container">
        <div id="menu" className="toggle" onClick={this.toggleList}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M2 6h20v3H2zm0 5h20v3H2zm0 5h20v3H2z"></path>
          </svg>
        </div>
        <div className={ listOpen ? "list open" : "list"}>
          <h2 className="appTitle">Red Bank Eats</h2>
          <hr />
          { /* render markers only when map has loaded */
            mapReady ?
            <ListView
              map={map}
              infowindow={infowindow}
              bounds={bounds}
              mapCenter={mapCenter}
            />
            : <p className="error"> Map has not loaded </p>
          }
          <img src={foursquare} alt="Powered by Foursquare" className="fs-logo"/>
        </div>
        <div id="map" className="map">
            <div className="loading">
              <h4 className="loading-message">Map is loading...</h4>
              <img src={spinner} className="spinner" alt="loading indicator" />
           </div>
        </div>
      </div>
    );
  }
}

export default scriptLoader(
    ["https://maps.googleapis.com/maps/api/js?key=AIzaSyAtZ3NiZU9KDjErK3LtaB0LogaW6GOFXYg"]
)(App);
