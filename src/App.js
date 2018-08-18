import React, { Component } from 'react';
import logo from './logo.svg';
import 'typeface-orbitron';
import './App.css';
import axios from 'axios';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      location: 'Here',
      icon: logo,
      useFahrenheit: false,
      error: 'no error',
      coord: {
        lon: 172.57,
        lat: -43.52,
      }
    };
    this.updateLatLon();
  }

  updateLatLon = function() {
    let me = this;
    let coord = this.state.coord;
    navigator.geolocation && navigator.geolocation.getCurrentPosition(
      position => {
        me.setState({
          error: null,
          coord: {
            lon: position.coords.longitude,
            lat: position.coords.latitude,
          }
        });
        console.log(position);
        this.getWeatherInfo();
      },
      error => {
        me.setState({ error : 'geolocation disabled'});
        console.log(error);
        this.getWeatherInfo();
      }, {
        timeout: 10000,
        enableHighAccuracy: true
      }
    );
    return coord;
  }

  getWeatherInfo = function() {
    let me = this;

    axios.get("https://fcc-weather-api.glitch.me/api/current", {
      params: me.state.coord
    }).then(
      response => {
        let data = response.data;
        if (data) {
          me.setState({
            location: data.name,
            icon: data.weather[0].icon,
            temperature: data.main.temp,
          });
        }
        console.log(data);
      },
      reason => {
        me.setState({error : 'Failed to access fcc-weather-api'});
        console.log(reason);
      }
    )
    .catch(function(error) {
      console.log(error);
      me.setState({error : 'Failed to access fcc-weather-api'});
    });
  }

  getTemperature = function() {
    if (this.state.useFahrenheit) {
      return (this.state.temperature * 1.8 + 32).toFixed(2) + ' F';
    } else {
      return (this.state.temperature).toFixed(2) + ' C';
    }
  }

  handleRefresh = async event => {
    event.preventDefault();
    this.updateLatLon();
  }

  useFahrenheit = event => {
    this.setState({ useFahrenheit: !this.state.useFahrenheit });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={this.state.icon} className="App-logo" alt="whether" />
          {
          this.state.temperature && 
          <button className="temp" onClick={this.useFahrenheit}>
            {this.getTemperature()}
          </button>
          }
          <h1 className="App-title">Welcome to {this.state.location}</h1>
        </header>
        {
          this.state.coord && 
          <div className="coord">
            <div className="digital"> {this.state.coord.lon.toFixed(2)} </div>
            <div className="digital"> {this.state.coord.lat.toFixed(2)} </div>
          </div>
        }
        { <button className="button" onClick={this.handleRefresh}>Refresh</button> }
        { this.state.error && <p className="bottom"> { this.state.error } </p> }
      </div>
    );
  }
}

export default App;
