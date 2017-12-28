import React, { Component } from 'react';
import { places } from './data/model.js';
import PropTypes from 'prop-types'

class ListView extends Component {

  static propTypes = {
    map: PropTypes.object.isRequired,
    infowindow: PropTypes.object.isRequired,
    bounds: PropTypes.object.isRequired
  }

  state = {
    query: '',
    listPlaces: []
  }

  componentDidMount () {
    this.setState({listPlaces: places});
    this.addMarkers();
  }

  addMarkers () {
    const { map, bounds } = this.props;
    const self = this;

    places.forEach( (location) =>  {
      location.marker = new window.google.maps.Marker({
        position: location.position,
        map: map,
        title: location.title
      });

      bounds.extend(location.position);

      location.marker.addListener('click', function() {
        const marker = this;
        marker.setAnimation(window.google.maps.Animation.BOUNCE);
        setTimeout(function() {
          marker.setAnimation(null);
        }, 2100);
        self.getFSDetails(marker)
      });

    });

    // size and center map
    map.fitBounds(bounds);
  }

  getFSDetails = (marker) => {
    const { map, infowindow } = this.props;
    const fSURL = 'https://api.foursquare.com/v2/venues/';
    const CLIENT_ID = 'PODXK0FF2KJDN3B2R1JSDYI2PRFR1WZLI1VVJUCRIP0OU45Q';
    const CLIENT_SECRET = 'WHN5N2D445VVITV1QTVMOBJYXIJWLOEWOCST10SJKNYBEXHB';
    const FSID = '412d2800f964a520df0c1fe3';
    const VERS = '20171227';
    const requestURL = `${fSURL}${FSID}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=${VERS}`
    fetch(requestURL)
    .then(response => response.json())
    .then(data => {
      const place = data.response.venue;
      marker.url = place.canonicalUrl ? place.canonicalUrl : 'https://foursquare.com/';
      const photo = place.bestPhoto ? place.bestPhoto : {};
      marker.photo = photo.prefix + 'width100' + photo.suffix;
      marker.description = place.description ? place.description : '';
      marker.infoContent = `<img src=${marker.photo} alt="${marker.title}">
                            <a href="${marker.url}"><h3>${marker.title}</h3></a>`
      console.log(marker.infoContent)
      infowindow.setContent(marker.infoContent);
      infowindow.open(map, marker);
    })
     .catch(error => alert('Foursquare request failed'));
  }
  filterPlaces = (event) => {

    const query = event.target.value.toLowerCase();
    this.setState({ query: query })
    const result = places.filter((place) => {
      const match = place.title.toLowerCase().indexOf(query) > -1;
      place.marker.setVisible(match);
      return match;
    })

    this.setState({listPlaces: result })
  }

  showInfo = (place) => {
    // force marker click
    window.google.maps.event.trigger(place.marker,'click');
  }

  render() {
    const {listPlaces, query} = this.state;

    return (
      <div className="list-view">
        <input type="text"
          placeholder="filter locations"
          value={ query }
          onChange={ this.filterPlaces }
          className="query"
        />
        {listPlaces.length > 0 ?
        <ul className="places-list">
          {listPlaces.map((place, id) =>
          <li
            key={id}
            className="place"
            onClick={this.showInfo.bind(this, place)}
            >{place.title}
          </li>
          )}
        </ul>
        : <p className="error">No places match filter</p>
        }
      </div>
    );
  }
}

export default ListView;
