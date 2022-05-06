import React, { Component } from 'react';
//import { extend } from 'jquery';
import { FilmsList } from './FilmsList';
import { FilmsListForUser } from './FilmsListForUser';
import { FilmsListBegin } from './FilmsListBegin';
//import { Modal, ModalHeader, ModalBody, ModalFooter } from 'react-bootstrap';
//import ReactDOM from 'react-dom'
import { ModalComponent } from './ModalComponent';
import { ModalLogIn } from './ModalLogIn';
import { CheckList } from './CheckList';


export class Home extends Component {
  static displayName = Home.name;

    render() {
        return (
            <CheckList />
            );
    }
}
