import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export class ModalLogIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = { modal: false, email: '', password: '' };

        this.toggle = this.toggle.bind(this);
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.LogOut = this.LogOut.bind(this);
        this.getCurrentUser = this.getCurrentUser.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }
    handleChangeEmail(event) {
        this.setState({ email: event.target.value });
    }
    handleChangePassword(event) {
        this.setState({ password: event.target.value });
    }
    getCurrentUser() {
        let request = new XMLHttpRequest();
        request.open("POST", "/api/Account/isAuthenticated", true);
        request.onload = function () {
            let myObj = "";
            myObj = request.responseText !== "" ?
                JSON.parse(request.responseText) : {};
            //document.getElementById("msg").innerHTML = myObj.message;
        }.bind(this);
        request.send();
    }
    handleSubmit(e) {
        e.preventDefault();
        var Email = this.state.email.trim();
        var Password = this.state.password.trim();

        if (Email && Password) {
            var url = "/api/Account/Login";
            var xhr = new XMLHttpRequest();
            xhr.open("post", url);
            xhr.setRequestHeader("Content-Type", "application/json;");
            xhr.responseType = 'json';
            xhr.onload = function () {
                let content = xhr.response;
                if (content.error)
                    alert(content.error);
                else {
                    this.setState({ email: "", password: "" })
                    alert(content.message);
                    this.toggle();
                    this.getCurrentUser();
                    this.props.onCheck();
                    window.location.reload();
                }
            }.bind(this);
            xhr.send(JSON.stringify({ email: Email, password: Password }));
        }
        else
            alert("Заполните все поля!");
    }
    LogOut() {
        //e.preventDefault();
        var request = new XMLHttpRequest();
        request.open("POST", "api/account/logoff");
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        request.responseType = 'json';
        request.onload = function () {
            let content = request.response;
            alert(content.message);
            this.getCurrentUser();
            this.props.onCheck();
        }.bind(this);
        request.send();
    }

    render() {
        return (
            <div>
                {/*<div id="msg">Вы Гость. Пожалуйста, выполните вход.</div>*/}
                <Button color="success" onClick={this.toggle} style={{ marginRight: '10px' }}>Войти</Button>
                {/*<Button color="danger" onClick={this.LogOut}>Выйти</Button>*/}
                <Modal isOpen={this.state.modal}>
                    <form onSubmit={this.handleSubmit}>
                        <ModalHeader><h5>Авторизация</h5></ModalHeader>

                        <ModalBody>
                            <form>
                                <p id="formError" />
                                <div className="form-group">
                                    <label for="InputEmail" className="control-label-required">Введите еmail:</label>
                                    <input type="email" className="form-control" id="InputEmail" value={this.state.email} onChange={this.handleChangeEmail} />
                                </div>
                                <div className="form-group">
                                    <label for="InputPassword" className="control-label-required">Введите пароль:</label>
                                    <input type="password" className="form-control" id="InputPassword" value={this.state.password} onChange={this.handleChangePassword} />
                                </div>
                            </form>
                        </ModalBody>

                        <ModalFooter>
                            <input type="submit" value="Войти" color="success" className="btn btn-success" />
                            <Button color="danger" onClick={this.toggle}>Отмена</Button>
                        </ModalFooter>
                    </form>
                </Modal>
            </div>
        );
    }
}