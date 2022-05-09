import React, { Component } from 'react';
import { ModalEdit } from './ModalEdit'
import { ModalAdd } from './ModalAdd';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export class Place extends React.Component { //класс места

    constructor(props) {
        super(props);
        this.state = { data: props.ticket };
    }
    render() { //в зависимости от статуса рендерим разное
        if (this.state.data.status == 0)
            return <button className="btn btn-warning" style={{ borderRadius: '20px', width: '40px', height: '40px', marginRight: '10px', marginBottom: '10px' }} disabled>{this.state.data.place}</button>
        else
            return <button className="btn btn-outline-success" style={{ borderRadius: '20px', width: '40px', height: '40px', marginRight: '10px', marginBottom: '10px' }} disabled>{this.state.data.place}</button>
    }
}

export class Row extends React.Component { //класс ряда

    constructor(props) {
        super(props);
        this.state = { places: [] };
    }
    render() {
        return (
            this.props.places.map(function (ticket) { //для каждого элемента ticket рендерим класс place 
                return <Place ticket={ticket} />
            })
        )
    }
}

export class Film extends Component { //класс фильма

    constructor(props) {
        super(props);
        this.state = { modal: false, time: '', hall: '', data: props.film, modal1: false, tickets: [], maxrow: 0 };
        this.onClick = this.onClick.bind(this);
        this.toggle = this.toggle.bind(this);
        this.handleChangeTime = this.handleChangeTime.bind(this);
        this.handleChangeHall = this.handleChangeHall.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.Tickets = this.Tickets.bind(this);
        this.toggle1 = this.toggle1.bind(this);
    }
    toggle() { //изменяем состояние отвечающее за вывод модального окна
        this.setState({
            modal: !this.state.modal
        });
    }
    toggle1() { //изменяем состояние отвечающее за вывод модального окна
        this.setState({
            modal1: !this.state.modal1
        });
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
            this.toggle1();
        }.bind(this);
        xhr.send();
    }
    handleChangeTime(event) {
        this.setState({ time: event.target.value });
    }
    handleChangeHall(event) {
        this.setState({ hall: event.target.value });
    }
    handleSubmit(e) { //добавление сеанса
        e.preventDefault();
        var time = this.state.time.trim();
        var hall = this.state.hall.trim();
        if (!time || !hall) {
            return;
        }
        
        var xhr = new XMLHttpRequest();
        xhr.open("post", "/api/sessions/"); //оправляем запрос на добавление сеанса
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.onload = function () {
            this.toggle();
            this.props.load();
        }.bind(this);
        xhr.send(JSON.stringify({ filmId: this.state.data.filmId, time: time, hallId: hall }));
    }

    onClick(e) { //удаление фильма
        this.props.onRemove(this.state.data);
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
                        <p>
                            <ModalEdit onFilmSubmit={this.props.onUpdate} film={this.state.data} />
                            <p></p>
                            <button className="btn btn-outline-success" onClick={this.onClick} style={{ marginRight: '10px' }}>Удалить</button>
                            <button className="btn btn-outline-success" onClick={this.toggle} style={{ marginRight: '10px' }}>Добавить сеанс</button>
                            
                        </p>
                        <p></p>
                        {
                            this.props.sessions.map(function (session) { //для каждого сеанса выводим номер зала, время и дату
                                var hall = session.hallId + " зал";
                                var data = session.time.split('T')[0];
                                var time = session.time.split('T')[1];
                                return <button className="btn btn-outline-success" onClick={() => tickets(session.sessionId)} style={{ marginRight: '10px' }}>
                                    <p>{hall}</p>
                                    <p>{data}</p>
                                    <p>{time}</p>
                                </button>
                            })
                        }
                    </td>
                </tr>
            </table>

            {/*//модальное окно для добавления сеанса*/}
            <Modal isOpen={this.state.modal}>
                <form onSubmit={this.handleSubmit}>
                    <ModalHeader><h5>Добавление сеанса</h5></ModalHeader>

                    <ModalBody>
                        <form>
                            <div className="form-group">
                                <label className="control-label required">Дата и время</label>
                                <input type="datetime-local"
                                    className="form-control" id="InputTime" required="required" placeholder="Выберете дату и время"
                                    value={this.state.time}
                                    onChange={this.handleChangeTime} />
                            </div>

                            <div className="form-group">
                                <label className="control-label required">Зал</label>
                                <input type="number" max="4" min="1"
                                    className="form-control" id="InputHall" required="required"
                                    value={this.state.hall}
                                    onChange={this.handleChangeHall} />
                            </div>
                        </form>
                    </ModalBody>

                    <ModalFooter>
                        <input type="submit" value="Добавить" color="success" className="btn btn-success" />
                        <Button color="danger" onClick={this.toggle}>Отмена</Button>
                    </ModalFooter>
                </form>
            </Modal>

            {/*модальное окно*/}
            <Modal className="modal-dialog modal-lg" isOpen={this.state.modal1} >
                <form>
                    <ModalHeader className="justify-content-center"><h5>Здесь вы можете ознакомиться с загрузкой зала</h5></ModalHeader>

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
                        <Button color="success" onClick={this.toggle1}>Ок</Button>
                    </ModalFooter>
                </form>
            </Modal>
        </div>;
    }
}

export class FilmsList extends React.Component { //класс листа фильмов

    constructor(props) {
        super(props);
        this.state = { films: [], genres: [], countries: [], sessions: [] };

        this.onAddFilm = this.onAddFilm.bind(this);
        this.onRemoveFilm = this.onRemoveFilm.bind(this);
        this.onUpdateFilm = this.onUpdateFilm.bind(this);
        this.loadData = this.loadData.bind(this);
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

        var xhr1 = new XMLHttpRequest(); //запрос на получение списка стран
        xhr1.open("get", "/api/Countries/", true);
        xhr1.onload = function () {
            console.log(xhr1.responseText);
            var data = JSON.parse(xhr1.responseText);
            this.setState({ countries: data });
        }.bind(this);
        xhr1.send();

        var xhr2 = new XMLHttpRequest(); //запрос на получение списка жанров
        xhr2.open("get", "/api/Genres/", true);
        xhr2.onload = function () {
            console.log(xhr2.responseText);
            var data = JSON.parse(xhr2.responseText);
            this.setState({ genres: data });
        }.bind(this);
        xhr2.send();

        var xhr3 = new XMLHttpRequest(); //запрос на получение списка сеансов
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
    // добавление объекта
    onAddFilm(film) {
        if (film) {
            var xhr = new XMLHttpRequest();
            xhr.open("post", this.props.apiUrl);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.onload = function () {
                this.loadData();
            }.bind(this);
            xhr.send(JSON.stringify({ name: film.name, genreId: film.genreId, timing: film.timing, countryId: film.countryId, poster: film.poster, description: film.description }));
        }
    }
    // удаление объекта
    onRemoveFilm(film) {

        var sessions;
        var xhr3 = new XMLHttpRequest();
        xhr3.open("get", "/api/Sessions/", true);
        xhr3.onload = function () {
            var data = JSON.parse(xhr3.responseText);
            sessions = data;
        }.bind(this);
        xhr3.send();

        let i = 0;
        for (i in sessions) {
            if (sessions[i].filmId = film.filmId) {
                xhr3 = new XMLHttpRequest();
                xhr3.open("delete", "/api/Sessions/", true);
                xhr3.onload = function () {
                    
                }.bind(this);
                xhr3.send(sessions[i].sessionId);
            }
        }

        if (film) {
            var url = this.props.apiUrl + "/" + film.filmId;

            var xhr = new XMLHttpRequest();
            xhr.open("delete", url, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.onload = function () {
                this.loadData();
            }.bind(this);
            xhr.send();
        }
    }
    //редактирование
    onUpdateFilm(film) {
        if (film) {
            var xhr = new XMLHttpRequest();
            xhr.open("PUT", "/api/films/" + film.filmId);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.onload = function () {
                this.loadData();
                this.forceUpdate();
            }.bind(this);
            xhr.send(JSON.stringify(film));
        }
    }
    render() {
        var load = this.loadData;
        var remove = this.onRemoveFilm;
        var edit = this.onEditFilm;
        var update = this.onUpdateFilm;
        var mygenres = this.state.genres;
        var mycountries = this.state.countries;
        var mysessions = this.state.sessions;
        return (
            <div>
                <ModalAdd onFilmSubmit={this.onAddFilm} />
                <p></p>
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
                            return <Film key={film.filmId} film={film} onRemove={remove} onEdit={edit} onUpdate={update} load={load} genre={mygenre} country={mycountry} sessions={sessionsoffilms}/>
                        })
                    }
                </div>
            </div>
        );
    }
}