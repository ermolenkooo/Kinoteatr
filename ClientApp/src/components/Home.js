import React, { Component } from 'react';
//import { extend } from 'jquery';
import { FilmsList } from './FilmsList';
//import { Modal, ModalHeader, ModalBody, ModalFooter } from 'react-bootstrap';
//import ReactDOM from 'react-dom'
import { ModalComponent } from './ModalComponent';
import { ModalLogIn } from './ModalLogIn';


export class Home extends Component {
  static displayName = Home.name;

  render () {
      return (
          <div >
              <ModalComponent />
              <p></p>
              <ModalLogIn />
              <FilmsList apiUrl="/api/films" />
          </div>
    );
  }
}
