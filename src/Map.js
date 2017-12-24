import React, { Component } from 'react';
import scriptLoader from 'react-async-script-loader';
import {mapStyles} from './utils/mapStyles.js'

const locations = [
          {title: 'Park Ave Penthouse', position: {lat: 40.7713024, lng: -73.9632393}},
          {title: 'Chelsea Loft', position: {lat: 40.7444883, lng: -73.9949465}},
          {title: 'Union Square Open Floor Plan', position: {lat: 40.7347062, lng: -73.9895759}},
          {title: 'East Village Hip Studio', position: {lat: 40.7281777, lng: -73.984377}},
          {title: 'TriBeCa Artsy Bachelor Pad', position: {lat: 40.7195264, lng: -74.0089934}},
          {title: 'Chinatown Homey Space', position: {lat: 40.7180628, lng: -74.9961237}}
        ];

// https://stackoverflow.com/questions/41709765/how-to-load-the-google-maps-api-script-in-my-react-app-only-when-it-is-require
class Map extends Component{

  componentWillReceiveProps({isScriptLoadSucceed}){
    if (isScriptLoadSucceed) {

      const map = new window.google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: {lat: 40.7413549, lng: -73.9980244},
        styles: mapStyles
      });

      const bounds = new window.google.maps.LatLngBounds();
      const infowindow = new window.google.maps.InfoWindow()

      locations.forEach( (location) =>  {
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

    } else {
      alert("Map did not load");
    }
  }

    render(){
        return(
                <div id="map" className="map">
                  Loading...
                </div>

        )
    }
}

export default scriptLoader(
    ["https://maps.googleapis.com/maps/api/js?key=AIzaSyAtZ3NiZU9KDjErK3LtaB0LogaW6GOFXYg"]
)(Map)
