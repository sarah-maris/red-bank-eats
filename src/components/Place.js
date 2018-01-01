import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Place extends Component {

  static propTypes = {
    place: PropTypes.object.isRequired
  }

  showInfo = () => {
    // force marker click
    window.google.maps.event.trigger(this.props.place.marker,'click');
  }

  render() {

    const { place } = this.props;

    return (
      <li className="place" onClick={this.showInfo} >
        {place.name}
      </li>
    );
  }
}

export default Place;
