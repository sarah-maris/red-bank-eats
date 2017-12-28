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
    const { map, infowindow, bounds } = this.props;

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
