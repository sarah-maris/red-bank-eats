import React, { Component } from 'react';
import { getFSLocations, getFSDetails } from '../apis/foursquare'
import noImage from '../images/no-image-available.png';
import fsButton from '../images/foursquare-button.png';
import foodIcon from '../images/food-marker.png';
import PropTypes from 'prop-types';

class ListView extends Component {

  static propTypes = {
    map: PropTypes.object.isRequired,
    infowindow: PropTypes.object.isRequired,
    bounds: PropTypes.object.isRequired,
    mapCenter: PropTypes.object.isRequired,
    toggleList: PropTypes.func.isRequired,
    listOpen: PropTypes.bool.isRequired
  }

  state = {
    query: '',
    allPlaces: [],
    filteredPlaces: []
  }

  componentDidMount () {
    getFSLocations(this.props.mapCenter)
    .then( places => {
      this.setState({
        allPlaces: places,
        filteredPlaces: places
      });
      this.addMarkers(places)
    });
  }

  addMarkers (places) {
    const { map, bounds, infowindow, toggleList } = this.props;
    const self = this;
    places.forEach( (location) =>  {

      const position = {
        lat: location.location.lat,
        lng: location.location.lng
      }

      location.marker = new window.google.maps.Marker({
        position: position,
        map: map,
        title: location.name,
        id: location.id,
        icon: foodIcon
      });

      bounds.extend(position);

      location.marker.addListener('click', function() {
        const marker = this;
        marker.setAnimation(window.google.maps.Animation.BOUNCE);
        setTimeout(function() {
          marker.setAnimation(null);
        }, 2100);
        getFSDetails(marker.id)
        .then(data => {
          const place = data.response.venue;

          // set up fallbacks in case data is incomplete
          marker.url = place.canonicalUrl ? place.canonicalUrl : 'https://foursquare.com/';
          marker.photo = place.bestPhoto ? place.bestPhoto.prefix +
                    'width100' + place.bestPhoto.suffix
                    : noImage;
          marker.phone = place.contact && place.contact.formattedPhone ? place.contact.formattedPhone : '';
          marker.address = place.location.address;
          marker.category = place.categories.length > 0 ? place.categories[0].name : '';
          marker.price = place.attributes.groups[0].summary &&  place.attributes.groups[0].type === "price" ?
                         place.attributes.groups[0].summary : '';
          marker.tip = place.tips.count > 0 ? `"${place.tips.groups[0].items[0].text}"` : 'No tips available';

          // build infowindonw content
          marker.infoContent = `<div class="place">
                                  <img class="place-photo" src=${marker.photo} alt="${marker.title}">
                                  <div class="place-meta">
                                    <h2 class="place-title">${marker.title}</h2>
                                    <p class="place-data">${marker.category}</p>
                                    <p class="place-price">${marker.price}</p>
                                    <p class="place-contact">${marker.address}</p>
                                    <a class="place-phone" href="tel:${marker.phone}">${marker.phone}</a>
                                  </div>
                                </div>
                                <p class="place-tip">${marker.tip}</p>
                                <a class="place-link" href="${marker.url}" target="_blank">
                                  <span>Read more</span>
                                  <img class="fs-link" src="${fsButton}">
                                </a>`

          // set content and open window after content has returned
          infowindow.setContent(marker.infoContent);
          infowindow.open(map, marker);

          // close list view in mobile if open so infowindow is not hidden by list
          if (self.props.listOpen) {
            toggleList()
          };
        })
      });
    });

    // size and center map
    map.fitBounds(bounds);
  }

  filterPlaces = (event) => {
    const { allPlaces } = this.state;
    const query = event.target.value.toLowerCase();
    this.setState({ query: query })
    const filteredPlaces = allPlaces.filter((place) => {
      const match = place.name.toLowerCase().indexOf(query) > -1;
      place.marker.setVisible(match);
      return match;
    })

    // sort before updating state
    filteredPlaces.sort(this.sortName);

    this.setState({filteredPlaces: filteredPlaces })
  }

  showInfo = (place) => {
    // force marker click
    window.google.maps.event.trigger(place.marker,'click');
  }

  render() {
    const {filteredPlaces, query} = this.state;

    return (
      <div className="list-view">
        <input type="text"
          placeholder="filter by name"
          value={ query }
          onChange={ this.filterPlaces }
          className="query"
        />
        {filteredPlaces.length > 0 ?
        <ul className="places-list">
          {filteredPlaces.map((place, id) =>
          <li
            key={id}
            className="place"
            onClick={this.showInfo.bind(this, place)}
            >{place.name}
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
