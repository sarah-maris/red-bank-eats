import React, { Component } from "react";
import PropTypes from "prop-types";

class Place extends Component {
  static propTypes = {
    place: PropTypes.object.isRequired,
    listOpen: PropTypes.bool.isRequired
  };

  showInfo = () => {
    // force marker click
    window.google.maps.event.trigger(this.props.place.marker, "click");
  };

  render() {
    const { place, listOpen } = this.props;

    return (
      <li className="place">
        <div
          onClick={this.showInfo}
          onKeyPress={this.showInfo}
          role="button"
          tabIndex={listOpen ? "0" : "-1"}
        >
          {place.name}
        </div>
      </li>
    );
  }
}

export default Place;
