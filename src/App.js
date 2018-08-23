import React, { Component } from 'react';
import './App.css';
import Router from 'Router';
import Footer from 'components/footer';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router/>
        <Footer/>
      </div>
    );
  }
}

export default App;
