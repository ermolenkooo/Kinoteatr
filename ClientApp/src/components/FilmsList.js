import React, { Component } from 'react';
import ReactDOM from 'react-dom'

export class Film extends React.Component {

    constructor(props) {
        super(props);
        this.state = { data: props.film };
        this.onClick = this.onClick.bind(this);
        this.onClickEdit = this.onClickEdit.bind(this);
    }
    onClick(e) {
        this.props.onRemove(this.state.data);
    }
    onClickEdit(e) {
        ReactDOM.render(
            <FilmFormEdit onFilmSubmit={this.props.onUpdate} film={this.state.data} />,
            document.getElementById("foredit")
        );
    }
    render() {
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
                            <button className="btn btn-outline-success" onClick={this.onClickEdit} style={{ marginRight: '10px' }}>Изменить</button>
                            <button className="btn btn-outline-success" onClick={this.onClick}>Удалить</button>
                        </p>
                    </td>
                </tr>
            </table>
        </div>;
    }
}

export class FilmForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = { name: "", timing: "", genreId: "", countryId: "", description: "", poster: "", genres: [], countries: [] };

        this.onSubmit = this.onSubmit.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.onTimingChange = this.onTimingChange.bind(this);
        this.onGenreChange = this.onGenreChange.bind(this);
        this.onCountryChange = this.onCountryChange.bind(this);
        this.onDescriptionChange = this.onDescriptionChange.bind(this);
    }
    onNameChange(e) {
        this.setState({ name: e.target.value, poster: e.target.value + ".png" });
    }
    onTimingChange(e) {
        this.setState({ timing: e.target.value });
    }
    onGenreChange(e) {
        this.setState({ genreId: e.target.value });
    }
    onCountryChange(e) {
        this.setState({ countryId: e.target.value });
    }
    onDescriptionChange(e) {
        this.setState({ description: e.target.value });
    }
    onSubmit(e) {
        e.preventDefault();
        var filmName = this.state.name.trim();
        var filmTiming = this.state.timing.trim();
        var filmGenre = this.state.genreId.trim();
        var filmCountry = this.state.countryId.trim();
        var filmDescription = this.state.description.trim();
        var filmPoster = "images/" + filmName + ".png";
        if (!filmName || !filmDescription || !filmTiming || !filmGenre || !filmCountry) {
            return;
        }
        this.props.onFilmSubmit({ name: filmName, description: filmDescription, timing: filmTiming, genreId: filmGenre, countryId: filmCountry, poster: filmPoster });
        this.setState({ name: "", timing: "", genreId: "", countryId: "", description: "", poster: "" });
    }
    // загрузка данных
    loadData() {
        var xhr1 = new XMLHttpRequest();
        xhr1.open("get", "/api/countries/", true);
        xhr1.onload = function () {
            console.log(xhr1.responseText);
            var data = JSON.parse(xhr1.responseText);
            this.setState({ countries: data });
        }.bind(this);
        xhr1.send();

        var xhr2 = new XMLHttpRequest();
        xhr2.open("get", "/api/genres/", true);
        xhr2.onload = function () {
            console.log(xhr2.responseText);
            var data = JSON.parse(xhr2.responseText);
            this.setState({ genres: data });
        }.bind(this);
        xhr2.send();
    }
    componentDidMount() {
        this.loadData();
    }
    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <h4>Добавление фильма</h4>
                <p>
                    <label className="control-label required">Название</label>
                    <input type="text"
                        className="form-control col-4" id="InputName" required="required" placeholder="Введите название"
                        value={this.state.name}
                        onChange={this.onNameChange} />
                </p>
                <p>
                    <label className="control-label required">Жанр</label>
                    <select className="form-control col-4" id="InputGenre" required="required" placeholder="Выберете жанр"
                        value={this.state.genreId}
                        onChange={this.onGenreChange}>
                        <option>Выберите жанр</option>
                        {
                            this.state.genres.map(function (genre) {
                                return <option value={genre.genreId}>{genre.name}</option>
                            })
                        }
                    </select>
                </p>
                <p>
                    <label className="control-label required">Хронометраж</label>
                    <input typeName="text"
                        class="form-control col-4" id="InputTiming" required="required" placeholder="Введите хронометраж"
                        value={this.state.timing}
                        onChange={this.onTimingChange} />
                </p>
                <p>
                    <label className="control-label required">Страна</label>
                    <select className="form-control col-4" id="InputCountry" required="required"
                        value={this.state.countryId}
                        onChange={this.onCountryChange}>
                        <option>Выберите страну</option>
                        {
                            this.state.countries.map(function (country) {
                                return <option value={country.countryId}>{country.name}</option>
                            })
                        }
                    </select>
                </p>
                <p>
                    <label className="control-label required">Описание</label>
                    <textarea className="form-control col-4" id="InputDescrip" placeholder="Введите описание"
                        value={this.state.description}
                        onChange={this.onDescriptionChange}>
                    </textarea>
                </p>
                <input type="submit" className="btn btn-success" id="mybutton" value="Сохранить" />
                <p></p>
            </form>
        );
    }
}

export class FilmsList extends React.Component {

    constructor(props) {
        super(props);
        this.state = { films: [], genres: [], countries: [] };

        this.onAddFilm = this.onAddFilm.bind(this);
        this.onRemoveFilm = this.onRemoveFilm.bind(this);
        this.onUpdateFilm = this.onUpdateFilm.bind(this);
    }
    // загрузка данных
    loadData() {
        var xhr = new XMLHttpRequest();
        xhr.open("get", this.props.apiUrl, true);
        xhr.onload = function () {
            console.log(xhr.responseText);
            var data = JSON.parse(xhr.responseText);
            this.setState({ films: data });
        }.bind(this);
        xhr.send();

        var xhr1 = new XMLHttpRequest();
        xhr1.open("get", "/api/Countries/", true);
        xhr1.onload = function () {
            console.log(xhr1.responseText);
            var data = JSON.parse(xhr1.responseText);
            this.setState({ countries: data });
        }.bind(this);
        xhr1.send();

        var xhr2 = new XMLHttpRequest();
        xhr2.open("get", "/api/Genres/", true);
        xhr2.onload = function () {
            console.log(xhr2.responseText);
            var data = JSON.parse(xhr2.responseText);
            this.setState({ genres: data });
        }.bind(this);
        xhr2.send();
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
                ReactDOM.render(
                    <p></p>,
                    document.getElementById("foredit")
                );
            }.bind(this);
            xhr.send(JSON.stringify(film));
        }
    }
    render() {
        var remove = this.onRemoveFilm;
        var edit = this.onEditFilm;
        var update = this.onUpdateFilm;
        var mygenres = this.state.genres;
        var mycountries = this.state.countries;
        return (
            <div>
                <FilmForm onFilmSubmit={this.onAddFilm} />
                <div id="foredit"></div>
                <h2>Список фильмов</h2>
                <div>
                    {

                        this.state.films.map(function (film) {
                            var mygenre, mycountry;
                            var i = 0;
                            for (i in mygenres) {
                                if (mygenres[i].genreId == film.genreId)
                                    mygenre = mygenres[i].name;
                            }
                            i = 0;
                            for (i in mycountries) {
                                if (mycountries[i].countryId == film.countryId)
                                    mycountry = mycountries[i].name;
                            }
                            return <Film key={film.filmId} film={film} onRemove={remove} onEdit={edit} onUpdate={update} genre={mygenre} country={mycountry} />
                        })
                    }
                </div>
            </div>
        );
    }
}


export class FilmFormEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: this.props.film.name, timing: this.props.film.timing, genreId: this.props.film.genreId,
            countryId: this.props.film.countryId, description: this.props.film.description, poster: this.props.film.poster, genres: [], countries: []
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.onTimingChange = this.onTimingChange.bind(this);
        this.onGenreChange = this.onGenreChange.bind(this);
        this.onCountryChange = this.onCountryChange.bind(this);
        this.onDescriptionChange = this.onDescriptionChange.bind(this);
    }
    onNameChange(e) {
        this.setState({ name: e.target.value, poster: e.target.value + ".png" });
    }
    onTimingChange(e) {
        this.setState({ timing: e.target.value });
    }
    onGenreChange(e) {
        this.setState({ genreId: e.target.value });
    }
    onCountryChange(e) {
        this.setState({ countryId: e.target.value });
    }
    onDescriptionChange(e) {
        this.setState({ description: e.target.value });
    }
    onSubmit(e) {
        e.preventDefault();
        var filmName = this.state.name.trim();
        var filmTiming = this.state.timing;
        var filmGenre = this.state.genreId;
        var filmCountry = this.state.countryId;
        var filmDescription = this.state.description.trim();
        var filmPoster = "images/" + filmName + ".png";
        var filmId = this.props.film.filmId;
        if (!filmName || !filmDescription || !filmTiming || !filmGenre || !filmCountry) {
            return;
        }
        this.props.onFilmSubmit({ filmId: filmId, name: filmName, description: filmDescription, timing: filmTiming, genreId: filmGenre, countryId: filmCountry, poster: filmPoster });
    }
    // загрузка данных
    loadData() {
        var xhr1 = new XMLHttpRequest();
        xhr1.open("get", "/api/countries/", true);
        xhr1.onload = function () {
            var data = JSON.parse(xhr1.responseText);
            this.setState({ countries: data });
        }.bind(this);
        xhr1.send();

        var xhr2 = new XMLHttpRequest();
        xhr2.open("get", "/api/genres/", true);
        xhr2.onload = function () {
            var data = JSON.parse(xhr2.responseText);
            this.setState({ genres: data });
        }.bind(this);
        xhr2.send();
    }
    componentDidMount() {
        this.loadData();
    }
    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <h4>Редактирование фильма</h4>
                <p>
                    <label className="control-label required">Название</label>
                    <input type="text"
                        className="form-control col-4" id="InputName1" required="required" placeholder="Введите название"
                        value={this.state.name}
                        onChange={this.onNameChange} />
                </p>
                <p>
                    <label className="control-label required">Жанр</label>
                    <select className="form-control col-4" id="InputGenre1" required="required" placeholder="Выберете жанр"
                        value={this.state.genreId}
                        onChange={this.onGenreChange}>
                        <option>Выберите жанр</option>
                        {
                            this.state.genres.map(function (genre) {
                                return <option value={genre.genreId}>{genre.name}</option>
                            })
                        }
                    </select>
                </p>
                <p>
                    <label className="control-label required">Хронометраж</label>
                    <input typeName="text"
                        class="form-control col-4" id="InputTiming1" required="required" placeholder="Введите хронометраж"
                        value={this.state.timing}
                        onChange={this.onTimingChange} />
                </p>
                <p>
                    <label className="control-label required">Страна</label>
                    <select className="form-control col-4" id="InputCountry1" required="required"
                        value={this.state.countryId}
                        onChange={this.onCountryChange}>
                        <option>Выберите страну</option>
                        {
                            this.state.countries.map(function (country) {
                                return <option value={country.countryId}>{country.name}</option>
                            })
                        }
                    </select>
                </p>
                <p>
                    <label className="control-label required">Описание</label>
                    <textarea className="form-control col-4" id="InputDescrip1" placeholder="Введите описание"
                        value={this.state.description}
                        onChange={this.onDescriptionChange}>
                    </textarea>
                </p>
                <input type="submit" className="btn btn-success" id="mybutton" value="Сохранить" />
                <p></p>
            </form>
        );
    }
}
