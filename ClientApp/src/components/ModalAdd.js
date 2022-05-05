import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export class ModalAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = { modal: false, name: "", timing: "", genreId: "", countryId: "", description: "", poster: "", genres: [], countries: [] };

        this.toggle = this.toggle.bind(this);
        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleChangeTiming = this.handleChangeTiming.bind(this);
        this.handleChangeGenre = this.handleChangeGenre.bind(this);
        this.handleChangeCountry = this.handleChangeCountry.bind(this);
        this.handleChangeDescription = this.handleChangeDescription.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }
    handleChangeName(event) {
        this.setState({ name: event.target.value });
    }
    handleChangeTiming(event) {
        this.setState({ timing: event.target.value });
    }
    handleChangeGenre(event) {
        this.setState({ genreId: event.target.value });
    }
    handleChangeCountry(event) {
        this.setState({ countryId: event.target.value });
    }
    handleChangeDescription(event) {
        this.setState({ description: event.target.value });
    }
    handleSubmit(e) {
        //e.preventDefault();
        //var Email = this.state.email.trim();
        //var Password = this.state.password.trim();
        //var PasswordConfirm = this.state.passwordConfirm.trim();

        //if (Email && Password && PasswordConfirm) {
        //    var url = "/api/Account/Register";
        //    var xhr = new XMLHttpRequest();
        //    xhr.open("post", url);
        //    xhr.setRequestHeader("Content-Type", "application/json;");
        //    xhr.responseType = 'json';
        //    xhr.onload = function () {
        //        let content = xhr.response;
        //        if (content.error)
        //            alert(content.error);
        //        else {
        //            this.setState({ email: "", password: "", passwordConfirm: "" })
        //            alert(content.message);
        //            this.toggle();
        //        }
        //    }.bind(this);
        //    xhr.send(JSON.stringify({ email: Email, password: Password, passwordConfirm: PasswordConfirm }));
        //}
        //else
        //    alert("Заполните все поля!");

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

        //var xhr = new XMLHttpRequest();
        //xhr.open("post", "/api/films/");
        //xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        //xhr.onload = function () {
        //    this.loadData();
        //}.bind(this);
        //xhr.send(JSON.stringify({ name: filmName, genreId: filmGenre, timing: filmTiming, countryId: filmCountry, poster: filmPoster, description: filmDescription }));
        this.toggle();
    }
    // загрузка данных
    loadData() {
        var xhr1 = new XMLHttpRequest();
        xhr1.open("get", "/api/countries/", true);
        xhr1.onload = function () {
            //console.log(xhr1.responseText);
            var data = JSON.parse(xhr1.responseText);
            this.setState({ countries: data });
        }.bind(this);
        xhr1.send();

        var xhr2 = new XMLHttpRequest();
        xhr2.open("get", "/api/genres/", true);
        xhr2.onload = function () {
            //console.log(xhr2.responseText);
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
            <div>
                <Button color="success" onClick={this.toggle}>Добавить фильм</Button>
                <Modal isOpen={this.state.modal}>
                    <form onSubmit={this.handleSubmit}>
                        <ModalHeader><h5>Добавление фильма</h5></ModalHeader>

                        <ModalBody>
                            <form>
                                <div className="form-group">
                                    <label className="control-label required">Название</label>
                                    <input type="text"
                                        className="form-control" id="InputName" required="required" placeholder="Введите название"
                                        value={this.state.name}
                                        onChange={this.handleChangeName} />
                                </div>

                                <div className="form-group">
                                    <label className="control-label required">Жанр</label>
                                    <select className="form-control" id="InputGenre" required="required" placeholder="Выберете жанр"
                                        value={this.state.genreId}
                                        onChange={this.handleChangeGenre}>
                                        <option>Выберите жанр</option>
                                        {
                                            this.state.genres.map(function (genre) {
                                                return <option value={genre.genreId}>{genre.name}</option>
                                            })
                                        }
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="control-label required">Хронометраж</label>
                                    <input typeName="text"
                                        class="form-control" id="InputTiming" required="required" placeholder="Введите хронометраж"
                                        value={this.state.timing}
                                        onChange={this.handleChangeTiming} />
                                </div>
                                <div className="form-group">
                                    <label className="control-label required">Страна</label>
                                    <select className="form-control" id="InputCountry" required="required"
                                        value={this.state.countryId}
                                        onChange={this.handleChangeCountry}>
                                        <option>Выберите страну</option>
                                        {
                                            this.state.countries.map(function (country) {
                                                return <option value={country.countryId}>{country.name}</option>
                                            })
                                        }
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="control-label required">Описание</label>
                                    <textarea className="form-control" id="InputDescrip" placeholder="Введите описание"
                                        value={this.state.description}
                                        onChange={this.handleChangeDescription}>
                                    </textarea>
                                </div>
                            </form>
                        </ModalBody>

                        <ModalFooter>
                            <input type="submit" value="Добавить" color="success" className="btn btn-success" />
                            <Button color="danger" onClick={this.toggle}>Отмена</Button>
                        </ModalFooter>
                    </form>
                </Modal>
            </div>
        );
    }
}
