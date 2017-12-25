import React, { Component } from 'react';
import scriptLoader from 'react-async-script-loader';
import { places } from './data/model.js';
import { mapStyles } from './data/mapStyles.js';
import spinner from './images/circles-loader.svg';

class Map extends Component{

  state = {
    map: {}
  }

  componentWillReceiveProps({isScriptLoadSucceed}){

    // Check if script is loaded and if map is defined
    if (isScriptLoadSucceed && !this.state.map.zoom ) {

      // create map
      const map = new window.google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: {lat: 40.7413549, lng: -73.9980244},
        styles: mapStyles
      });

      this.setState({map: map});

      // TODO: Move markers to separate component
      const bounds = new window.google.maps.LatLngBounds();
      const infowindow = new window.google.maps.InfoWindow();

      places.forEach( (location) =>  {
        location.marker = new window.google.maps.Marker({
          position: location.position,
          map: map,
          title: location.title
        });
        bounds.extend(location.position);

        location.marker.addListener('click', function() {
          const marker = this;
          infowindow.setContent(marker.title);
          infowindow.open(map, marker);
          marker.setAnimation(window.google.maps.Animation.BOUNCE);
          setTimeout(function() {
            marker.setAnimation(null);
          }, 2100);
        });

      });

      // size and center map
      map.fitBounds(bounds);

    // alert user if map request fails
    } else if ( !this.state.map.zoom ) {
      alert("Map did not load");
    }
  }

    render(){
        return(
          <div id="map" className="map">
              <div className="loading">
                <h4 className="loading-message">Map is loading...</h4>
                <img src={spinner} className="spinner" alt="loading indicator" />
             </div>
          </div>
        )
    }
}

export default scriptLoader(
    ["https://maps.googleapis.com/maps/api/js?key=AIzaSyAtZ3NiZU9KDjErK3LtaB0LogaW6GOFXYg"]
)(Map);
