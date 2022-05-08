import React, { Component } from 'react';

export class Ticket extends React.Component {

    constructor(props) {
        super(props);
        this.state = { data: props.ticket };
    }
    render() {
        return <div>
            <table className="table table-striped table-hover" id="filmsTable" style={{ fontFamily: 'Courier New' }}>
                <tr>
                    <td valign="top" align="right">
                        <img src={this.props.film.poster} style={{ width: '250px' }} />
                    </td>
                    <td valign="top" align="left">
                        <h4 align="left"><b>{this.props.film.name}</b></h4>
                        <h5 align="left">Время: {this.props.session.time}</h5>
                        <h5 align="left">Зал: {this.props.session.hallId}</h5>
                        <h5 align="left">Ряд: {this.state.data.row}</h5>
                        <h5 align="left">Место: {this.state.data.place}</h5>
                        <h5 align="left">Цена: {this.state.data.price}</h5>
                    </td>
                </tr>
            </table>
        </div>;
    }
}

export class MyTickets extends Component {
    static displayName = MyTickets.name;

    constructor(props) {
        super(props);
        this.state = { films: [], sessions: [], tickets: [], user: "" };
    }
    // загрузка данных
    loadData() {
        var xhr = new XMLHttpRequest();
        xhr.open("get", "/api/films/", true);
        xhr.onload = function () {
            var data = JSON.parse(xhr.responseText);
            this.setState({ films: data });
        }.bind(this);
        xhr.send();

        var xhr1 = new XMLHttpRequest();
        xhr1.open("get", "/api/sessions/", true);
        xhr1.onload = function () {
            console.log(xhr1.responseText);
            var data = JSON.parse(xhr1.responseText);
            this.setState({ sessions: data });
        }.bind(this);
        xhr1.send();

        var xhr2 = new XMLHttpRequest();
        xhr2.open("get", "/api/tickets/", true);
        xhr2.onload = function () {
            console.log(xhr2.responseText);
            var data = JSON.parse(xhr2.responseText);
            this.setState({ tickets: data });
        }.bind(this);
        xhr2.send();

        var url = "/api/Account/isAuthenticated";
        var xhr3 = new XMLHttpRequest();
        xhr3.open("post", url, true);
        xhr3.onload = function () {
            var data = JSON.parse(xhr3.responseText);
            this.setState({ user: data.userId });
            //window.location.reload();
        }.bind(this);
        xhr3.send();
        //this.forceUpdate();
    }
    componentDidMount() {
        this.loadData();
    }
    render() {
        //var mytickets = this.state.tickets;
        var myfilms = this.state.films;
        var mysessions = this.state.sessions;
        var user = this.state.user;
        return (
            <div>
                <div>
                    {
                        this.state.tickets.map(function (ticket) {
                            var myfilm, mysession;
                            if (ticket.viewerId == user) {
                                var i = 0;
                                for (i in mysessions) {
                                    if (mysessions[i].sessionId == ticket.sessionId)
                                        mysession = mysessions[i];
                                }
                                i = 0;
                                for (i in myfilms) {
                                    if (myfilms[i].filmId == mysession.filmId)
                                        myfilm = myfilms[i];
                                }
                                return <Ticket ticket={ticket} film={myfilm} session={mysession} />
                            }
                        })
                    }
                </div>
            </div>
        );
    }
}