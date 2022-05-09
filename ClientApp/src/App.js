import React, { Component } from 'react';
import { Route, Redirect } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { MyTickets } from './components/MyTickets';

import './custom.css'

export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
      <Layout>
        <Route exact path='/home' component={Home} /> 
        <Route path='/myTickets' component={MyTickets} />
        <Redirect from='/' to='/home' />
      </Layout>
    );
  }
}
