import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation';
import GameBoard from './components/GameBoard';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Navigation></Navigation>
        <div className="content">
          <GameBoard/>
        </div>
      </div>

    );
  }
}

export default App;
