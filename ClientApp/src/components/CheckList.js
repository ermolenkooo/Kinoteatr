import React, { Component } from 'react';
import { FilmsList } from './FilmsList';
import { FilmsListForUser } from './FilmsListForUser';
import { FilmsListBegin } from './FilmsListBegin';

export class CheckList extends Component {

    constructor(props) {
        super(props);
        this.state = { role: "" };
        this.CheckRole = this.CheckRole.bind(this);
    }

    CheckRole() { //проверка роли
        var url = "/api/Account/isAuthenticated";
        var xhr = new XMLHttpRequest();
        xhr.open("post", url, true);
        xhr.onload = function () {
            var data = JSON.parse(xhr.responseText);
            this.setState({ role: data.role });
        }.bind(this);
        xhr.send();
        this.forceUpdate();
    }
    componentDidMount() {
        this.CheckRole();
    }

    render() { //в зависимости от роли рендерим разное
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
