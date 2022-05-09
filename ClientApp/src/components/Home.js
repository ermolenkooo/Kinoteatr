import React, { Component } from 'react';
import { CheckList } from './CheckList';


export class Home extends Component {
  static displayName = Home.name;

    render() {
        return (
            <CheckList />
            );
    }
}
