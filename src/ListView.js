import React, { Component } from 'react';
import PropTypes from 'prop-types'

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

    this.getFSLocations()
    .then( places => this.addMarkers(places));
  }

  addMarkers (places) {
    const { map, bounds } = this.props;
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
        id: location.id
      });

      bounds.extend(position);

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
  getFSLocations = () => {
    const { mapCenter } = this.props;
    const fSURL = 'https://api.foursquare.com/v2/venues/';
    const CLIENT_ID = 'PODXK0FF2KJDN3B2R1JSDYI2PRFR1WZLI1VVJUCRIP0OU45Q';
    const CLIENT_SECRET = 'WHN5N2D445VVITV1QTVMOBJYXIJWLOEWOCST10SJKNYBEXHB';
    const FSID = '412d2800f964a520df0c1fe3';
    const VERS = '20171227';
    const CATEGORIES = {
      american: '4bf58dd8d48988d14e941735',
      asian: '4bf58dd8d48988d142941735',
      pub: '4bf58dd8d48988d11b941735',
      italian:  '4bf58dd8d48988d110941735',
      indian: '4bf58dd8d48988d10f941735',
      greek: '4bf58dd8d48988d10e941735',
      french: '4bf58dd8d48988d10c941735',
      diner: '4bf58dd8d48988d147941735',
      mediterranean: '4bf58dd8d48988d1c0941735',
      mexican: '4bf58dd8d48988d1c1941735',
      middleEastern: '4bf58dd8d48988d115941735',
      steakhouse: '4bf58dd8d48988d1cc941735',
      vegetarian: '4bf58dd8d48988d1d3941735'
    }

    const CATEGORY_ID = Object.keys(CATEGORIES).map((cat) => CATEGORIES[cat]);
    const RADIUS = '1250'
//https://stackoverflow.com/questions/39245994/use-fetch-to-send-get-request-with-data-object
    const requestURL = `${fSURL}search?ll=${mapCenter.lat},${mapCenter.lng}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=${VERS}&categoryId=${CATEGORY_ID}&radius=${RADIUS}&limit=50`
    return fetch(requestURL)
    .then(response => response.json())
    .then(data => {
      const places = data.response.venues;
      const goodPlaces = places.filter( place => place.location.address && place.location.city && place.location.city == "Red Bank");
      // TODO alphabetize list
      this.setState({
        allPlaces: goodPlaces,
        filteredPlaces: goodPlaces
      });
      return goodPlaces;
    })
     .catch(error => alert('Foursquare request failed'));
  }

  getFSDetails = (marker) => {
    const { map, infowindow } = this.props;
    const fSURL = 'https://api.foursquare.com/v2/venues/';
    const CLIENT_ID = 'PODXK0FF2KJDN3B2R1JSDYI2PRFR1WZLI1VVJUCRIP0OU45Q';
    const CLIENT_SECRET = 'WHN5N2D445VVITV1QTVMOBJYXIJWLOEWOCST10SJKNYBEXHB';
    const FSID =  marker.id; //'412d2800f964a520df0c1fe3';
    const VERS = '20171227';
    const CATEGORY_ID = '4bf58dd8d48988d1c4941735' // restaurants

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
      if (this.props.listOpen) this.props.toggleList();
    })
     .catch(error => alert('Foursquare request failed'));
  }
  filterPlaces = (event) => {
    const { allPlaces } = this.state;
    const query = event.target.value.toLowerCase();
    this.setState({ query: query })
    const result = allPlaces.filter((place) => {
      console.log(place)
      const match = place.name.toLowerCase().indexOf(query) > -1;
      place.marker.setVisible(match);
      return match;
    })

    this.setState({filteredPlaces: result })
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
