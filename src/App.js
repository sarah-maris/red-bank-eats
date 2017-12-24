import React, { Component } from 'react';
import './App.css';
import Map from './Map'


class App extends Component {

  state = { listOpen: true }

  toggleList = () => {
    this.setState( { listOpen: !this.state.listOpen})
  }

  render() {

  const { listOpen } = this.state;
    return (
      <div className="container">
        <div id="menu" className="toggle" onClick={this.toggleList}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M2 6h20v3H2zm0 5h20v3H2zm0 5h20v3H2z"></path>
          </svg>
        </div>
          <div className={ listOpen ? "list open" : "list"}></div>
        <Map />
      </div>
    );
  }
}

export default App;
