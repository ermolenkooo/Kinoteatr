import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

var selectedTickets = []; //выбранные билеты

export class Place extends React.Component { //класс места

    constructor(props) {
        super(props);
        this.state = { data: props.ticket, clicked: false };
        this.onClick = this.onClick.bind(this);
    }
    onClick(e) { //при клике добавляем или удаляем билет из массива выбранных билетов и меняем состояние 
        e.preventDefault();
        this.setState({ clicked: !this.state.clicked });
        if (this.state.clicked == false)
            selectedTickets.push(this.state.data);
        else {
            var i = selectedTickets.indexOf(this.state.data, 0);
            selectedTickets.splice(i, 1);
        }
        this.setState({ clicked: !this.state.clicked });
        console.log(selectedTickets);

    }
    render() { //в зависимости от статуса и состояния рендерим разное
        if (this.state.data.status == 0)
            return <button className="btn btn-warning" style={{ borderRadius: '20px', width: '40px', height: '40px', marginRight: '10px', marginBottom: '10px' }} disabled>{this.state.data.place}</button>
        else if (this.state.clicked == false)
            return <button className="btn btn-outline-success" style={{ borderRadius: '20px', width: '40px', height: '40px', marginRight: '10px', marginBottom: '10px' }} onClick={this.onClick} >{this.state.data.place}</button>
        else
            return <button className="btn btn-success" style={{ borderRadius: '20px', width: '40px', height: '40px', marginRight: '10px', marginBottom: '10px' }} onClick={this.onClick} >{this.state.data.place}</button>
    }
}

export class Row extends React.Component { //класс ряда

    constructor(props) {
        super(props);
        this.state = { places: [] };
    }
    render() {
        return(
            this.props.places.map(function (ticket) { //для каждого элемента ticket рендерим класс place 
                return <Place ticket={ticket} />
            })
    )}
}

export class Film extends React.Component { //класс фильма

    constructor(props) {
        super(props);
        this.state = { data: props.film, modal: false, tickets: [], maxrow: 0 };
        this.Tickets = this.Tickets.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.toggle = this.toggle.bind(this);
    }
    toggle() { //изменяем состояние отвечающее за вывод модального окна
        this.setState({
            modal: !this.state.modal
        });
    }
    handleSubmit(e) { //обрабатываем клик на кнопку "забронировать билеты"
        e.preventDefault();
        this.toggle(); //скрываем модальное окно
        var xhr = new XMLHttpRequest();
        xhr.open("post", "/api/booking/", true); //отправляем запрос на бронирование
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = function () {
            alert("Билеты успешно забронированы! :)")
        }.bind(this);
        xhr.send(JSON.stringify(selectedTickets));
    }
    Tickets(session) { 
        var alltickets;
        var xhr = new XMLHttpRequest(); //получаем все сеансы по запросу, ищем максимальный рад (количество рядов), заполняем массив рядов
        xhr.open("get", "/api/tickets/", true);
        xhr.onload = function () {
            var data = JSON.parse(xhr.responseText);
            alltickets = data;
            let max = 0;
            let i = 0;
            for (i in alltickets) {
                if (alltickets[i].row > max && alltickets[i].sessionId == session)
                    max = alltickets[i].row;
            }
            this.setState({ maxrow: max });

            var rows = [];
            var row = [];
            for (i = 1; i <= max; i++) {
                let j = 0;
                for (j in alltickets) {
                    if (i == alltickets[j].row && alltickets[j].sessionId == session)
                        row.push(alltickets[j]);
                }
                rows.push(row);
                row = [];
            }
            this.setState({ tickets: rows });
            this.toggle();
        }.bind(this);
        xhr.send();
    }
    render() { //каждый фильм будет представлен таблицей с двумя столбиками
        var tickets = this.Tickets;
        return <div>
            <table className="table table-striped table-hover" id="filmsTable" style={{ fontFamily: 'Courier New' }}>
                <tr>
                    <td valign="top">
                        <img src={this.state.data.poster} style={{ width: '400px' }} />
                    </td>
                    <td valign="top">
                        <h4><b>{this.state.data.name}</b></h4>
                        <h5 align='justify'>{this.state.data.description}</h5>
                        <h5>Жанр: {this.props.genre}</h5>
                        <h5>Страна: {this.props.country}</h5>
                        <h5>Хронометраж: {this.state.data.timing}</h5>
                        <p></p>
                        {
                            this.props.sessions.map(function (session) { //для каждого сеанса выводим номер зала, время и дату
                                var hall = session.hallId + " зал";
                                var data = session.time.split('T')[0];
                                var time = session.time.split('T')[1];
                                return <button className="btn btn-outline-success" onClick={ () => tickets(session.sessionId) } style={{ marginRight: '10px' }}>
                                    <p>{hall}</p>
                                    <p>{data}</p>
                                    <p>{time}</p>
                                </button>
                            })
                        }
                    </td>
                </tr>
            </table>

            {/*модальное окно*/}
            <Modal className="modal-dialog modal-lg" isOpen={this.state.modal} >
                <form onSubmit={this.handleSubmit}>
                    <ModalHeader className="justify-content-center"><h5>Выберите места, которые хотите забронировать</h5></ModalHeader>

                    <ModalBody className="justify-content-center">
                        <p align="center">Экран</p>
                        <p align="center">--------------------------------------------------------</p>
                        <div className="justify-content-center">
                            {
                                this.state.tickets.map(function (row) { //для каждого элемента row рендерим класс row
                                    return <div><Row places={row} /></div>
                                })
                                
                            }
                        </div>
                    </ModalBody>

                    <ModalFooter>
                        <input type="submit" value="Забронировать" color="success" className="btn btn-success" />
                        <Button color="danger" onClick={this.toggle}>Отмена</Button>
                    </ModalFooter>
                </form>
            </Modal>

        </div>;
    }
}

export class FilmsListForUser extends React.Component { //класс листа фильмов

    constructor(props) {
        super(props);
        this.state = { films: [], genres: [], countries: [], sessions: [] };
    }
    // загрузка данных
    loadData() {
        var xhr = new XMLHttpRequest(); //запрос на получение списка фильмов
        xhr.open("get", this.props.apiUrl, true);
        xhr.onload = function () {
            console.log(xhr.responseText);
            var data = JSON.parse(xhr.responseText);
            this.setState({ films: data });
        }.bind(this);
        xhr.send();

        var xhr1 = new XMLHttpRequest(); //запрос на получение всех стран
        xhr1.open("get", "/api/Countries/", true);
        xhr1.onload = function () {
            console.log(xhr1.responseText);
            var data = JSON.parse(xhr1.responseText);
            this.setState({ countries: data });
        }.bind(this);
        xhr1.send();

        var xhr2 = new XMLHttpRequest(); //запрос на получение всех жанров
        xhr2.open("get", "/api/Genres/", true);
        xhr2.onload = function () {
            console.log(xhr2.responseText);
            var data = JSON.parse(xhr2.responseText);
            this.setState({ genres: data });
        }.bind(this);
        xhr2.send();

        var xhr3 = new XMLHttpRequest(); //запрос на получение всех сеансов
        xhr3.open("get", "/api/Sessions/", true);
        xhr3.onload = function () {
            console.log(xhr3.responseText);
            var data = JSON.parse(xhr3.responseText);
            this.setState({ sessions: data });
        }.bind(this);
        xhr3.send();
    }
    componentDidMount() {
        this.loadData();
    }
    render() {
        var mygenres = this.state.genres;
        var mycountries = this.state.countries;
        var mysessions = this.state.sessions;
        return (
            <div>
                <h2><b>Список фильмов</b></h2>
                <div>
                    {
                        this.state.films.map(function (film) {
                            var mygenre, mycountry;
                            var sessionsoffilms = [];
                            var i = 0;
                            for (i in mygenres) { //определяем жанр фильма
                                if (mygenres[i].genreId == film.genreId)
                                    mygenre = mygenres[i].name;
                            }
                            i = 0;
                            for (i in mycountries) { //определяем страну фильма
                                if (mycountries[i].countryId == film.countryId)
                                    mycountry = mycountries[i].name;
                            }
                            i = 0;
                            for (i in mysessions) { //ищем все сеансы фильма
                                if (mysessions[i].filmId == film.filmId)
                                    sessionsoffilms.push(mysessions[i]);
                            }//для каждого элемента рендерим класс film
                            return <Film key={film.filmId} film={film} genre={mygenre} country={mycountry} sessions={sessionsoffilms} />
                        })
                    }
                </div>
            </div>
        );
    }
}