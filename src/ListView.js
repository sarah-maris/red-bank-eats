import React, { Component } from 'react';
import { places } from './data/model.js';

class ListView extends Component {

  state = {
    query: '',
    listPlaces: []
  }

  componentDidMount () {
    this.setState({listPlaces: places});
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
    console.log("clicked", place)
  }

  render() {
    const {listPlaces, query} = this.state;

    return (
      <div className="list-view">
        <input type="text"
          placeholder="filter locations"
          value={ query }
          onChange={ this.filterPlaces }
          className='query'/>
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
        : <p className="filterErr">No places match filter</p>
        }
      </div>
    );
  }
}

export default ListView;
