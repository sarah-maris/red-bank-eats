import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"

const locations = [
          {title: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}},
          {title: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}},
          {title: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}},
          {title: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}},
          {title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}},
          {title: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -74.9961237}}
        ];

const MyMapComponent = withScriptjs(withGoogleMap((props) =>
  <GoogleMap
    ref={(ref) => { this.map = ref }}
    defaultZoom={13}
    defaultCenter={ {lat: 40.7413549, lng: -73.9980244}}
  >
{locations.map(marker =>  {
  return <Marker position={marker.location} key={marker.title} />})}

  </GoogleMap>
))



class App extends Component {
  render() {



    return (
      <div className="App">

        <MyMapComponent

          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyD4Hf4D47wT3dI_iA6kyul2YFsvzjDMHFE"
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `400px` }} />}
          mapElement={<div style={{ height: `100%` }} />}
        />

        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
