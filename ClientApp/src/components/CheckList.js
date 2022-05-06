import React, { Component } from 'react';
//import { extend } from 'jquery';
import { FilmsList } from './FilmsList';
import { FilmsListForUser } from './FilmsListForUser';
import { FilmsListBegin } from './FilmsListBegin';
//import { Modal, ModalHeader, ModalBody, ModalFooter } from 'react-bootstrap';
//import ReactDOM from 'react-dom'
import { ModalComponent } from './ModalComponent';
import { ModalLogIn } from './ModalLogIn';
import { ModalAdd } from './ModalAdd';


export class CheckList extends Component {

    constructor(props) {
        super(props);
        this.state = { role: "" };
        this.CheckRole = this.CheckRole.bind(this);
    }

    CheckRole() {
        var url = "/api/Account/isAuthenticated";
        var xhr = new XMLHttpRequest();
        xhr.open("post", url, true);
        //xhr.setRequestHeader("Content-Type", "application/json;");
        //xhr.responseType = 'json';
        xhr.onload = function () {
            var data = JSON.parse(xhr.responseText);
            this.setState({ role: data.role });
            //this.forceUpdate();
        }.bind(this);
        xhr.send();
        this.forceUpdate();
        //this.render();
    }
    componentDidMount() {
        this.CheckRole();
    }

    render() {
        var roles = this.CheckRole;
        if (this.state.role === "admin")
            return (
                <>
                    <FilmsList apiUrl="/api/films" />
                </>
            );
        else
            if (this.state.role === "user")
                return (
                    <>
                        <FilmsListForUser apiUrl="/api/films" />
                    </>
                );
            else return (
                <>
                    <FilmsListBegin apiUrl="/api/films" />
                </>
            );
    }
}
