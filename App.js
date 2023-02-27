// * Description: App Entry Point
import React, { Component } from 'react';
import('./ReactotronConfig').then(() => console.log('Reactotron Configured'));
import Router from './app/router';

export default class App extends Component {
  render() {
    return <Router />;
  }
}
