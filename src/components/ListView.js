import React, { Component } from 'react';
import { getFSLocations, getFSDetails } from '../apis/foursquare'
import noImage from '../images/no-image-available.png';
import fsButton from '../images/foursquare-button.png';
import foodIcon from '../images/food-marker.png';
import spinner from '../images/circles-loader.svg';
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
    filteredPlaces: null,
    apiReturned: false
  }

  componentDidMount () {
    getFSLocations(this.props.mapCenter)
    .then( places => {
      this.setState({
        allPlaces: places,
        filteredPlaces: places,
        apiReturned: true
      });
      if(places) this.addMarkers(places)
    })
    .catch(error => this.setState({apiReturned: true}));
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
        position,
        map,
        title: location.name,
        id: location.id,
        icon: foodIcon
      });

      bounds.extend(position);

      location.marker.addListener('click', function() {
        const marker = this;

        // bounce marker three times then stop
        marker.setAnimation(window.google.maps.Animation.BOUNCE);
        setTimeout(function() {
          marker.setAnimation(null);
        }, 2100);

        // get venue details and display in infowindow
        getFSDetails(marker.id)
        .then(data => {
          const place = data.response.venue;

          // set up fallbacks in case data is incomplete

          const { canonicalUrl, bestPhoto, contact, location, categories, attributes, tips } = place; // destructuring
          marker.url = canonicalUrl ? canonicalUrl : 'https://foursquare.com/';
          marker.photo = bestPhoto ? `${bestPhoto.prefix}width100${bestPhoto.suffix}` // ES6 template literals
                    : noImage;
          marker.phone = contact && contact.formattedPhone ? contact.formattedPhone : '';
          marker.address = location.address;
          marker.category = categories.length > 0 ? categories[0].name : '';
          marker.price = attributes.groups[0].summary &&  attributes.groups[0].type === "price" ?
                          attributes.groups[0].summary : '';
          marker.tip = tips.count > 0 ? `"${tips.groups[0].items[0].text}"` : 'No tips available';

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
        .catch(error =>  {
          marker.infoContent = `<div class="venue-error">
                  <h3>Foursquare Venue Details request for ${marker.title} failed</h3>
                  <p>Try again later...</p>
                </div>`
          // set content and open window
          infowindow.setContent(marker.infoContent);
          infowindow.open(map, marker);

          // close list view in mobile if open so infowindow is not hidden by list
          if (self.props.listOpen) {
            toggleList()
          };
        });
      });
    });

    // size and center map
    map.fitBounds(bounds);
  }

  filterPlaces = (event) => {

    const { allPlaces } = this.state;
    const query = event.target.value.toLowerCase();

    // update state so input box shows current query value
    this.setState({ query: query })

    // filter list markers by name of location
    const filteredPlaces = allPlaces.filter((place) => {
      const match = place.name.toLowerCase().indexOf(query) > -1;
      place.marker.setVisible(match);
      return match;
    })

    // sort array before updating state
    filteredPlaces.sort(this.sortName);

    this.setState({filteredPlaces: filteredPlaces })
  }

  showInfo = (place) => {
    // force marker click
    window.google.maps.event.trigger(place.marker,'click');
  }

  render() {

    const {apiReturned, filteredPlaces, query} = this.state;

    // API request fails
    if(apiReturned && !filteredPlaces) {
      return <div> Foursquare API request failed. Please try again later.</div>

   // API request returns successfully
    } else if( apiReturned && filteredPlaces ){
      return (
        <div className="list-view">
          <input type="text"
            placeholder="filter by name"
            value={ query }
            onChange={ this.filterPlaces }
            className="query"
            role="search"
          />
          { apiReturned && filteredPlaces.length > 0 ?
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
          : <p id="filter-error" className="error">No places match filter</p>
          }
        </div>
      );

    // API request has not returned yet
    } else {
      return (
        <div className="loading-fs">
          <h4 className="loading-message">Loading Restaurants...</h4>
          <img src={spinner} className="spinner" alt="loading indicator" />
       </div>
     )
    }

  }
}

export default ListView;
