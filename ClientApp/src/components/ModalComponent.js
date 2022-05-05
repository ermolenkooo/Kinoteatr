import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export class ModalComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = { modal: false, email: '', password: '', passwordConfirm: '' };

        this.toggle = this.toggle.bind(this);
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleChangePasswordConfirm = this.handleChangePasswordConfirm.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        //this.ParseResponse = this.ParseResponse.bind(this);
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
    handleChangePasswordConfirm(event) {
        this.setState({ passwordConfirm: event.target.value });
    }
    //ParseResponse(e) {
    //    document.querySelector("#formError").innerHTML.value = "";
    //    let response = JSON.parse(e.responseText);
    //    if (response.error.lenght > 0)
    //        document.querySelector("#formError").innerHTML.value = response.error[0];
    //}
    handleSubmit(e) {
        e.preventDefault();
        var Email = this.state.email.trim();
        var Password = this.state.password.trim();
        var PasswordConfirm = this.state.passwordConfirm.trim();

        if (Email && Password && PasswordConfirm) {
            var url = "/api/Account/Register";
            var xhr = new XMLHttpRequest();
            xhr.open("post", url);
            xhr.setRequestHeader("Content-Type", "application/json;");
            xhr.responseType = 'json';
            xhr.onload = function () {
                let content = xhr.response;
                if (content.error)
                    alert(content.error);
                else {
                    this.setState({ email: "", password: "", passwordConfirm: "" })
                    alert(content.message);
                    this.toggle();
                }
            }.bind(this);
            xhr.send(JSON.stringify({ email: Email, password: Password, passwordConfirm: PasswordConfirm }));
        }
        else
            alert("Заполните все поля!");
    }

    render() {
        return (
            <div>
                <Button color="success" onClick={this.toggle}>Регистрация</Button>
                <Modal isOpen={this.state.modal}>
                    <form onSubmit={this.handleSubmit}>
                    <ModalHeader><h5>Регистрация</h5></ModalHeader>

                        <ModalBody>
                            <form>
                            <p id="formError"/>
                            <div className="form-group">
                                <label for="InputEmail" className="control-label-required">Введите еmail:</label>
                                <input type="email" className="form-control" id="InputEmail" value={this.state.email} onChange={this.handleChangeEmail} />
                            </div>
                            <div className="form-group">
                                <label for="InputPassword" className="control-label-required">Введите пароль:</label>
                                <input type="password" className="form-control" id="InputPassword" value={this.state.password} onChange={this.handleChangePassword} />
                            </div>
                            <div className="form-group">
                                <label for="InputPasswordCon" className="control-label-required">Подтвердите пароль:</label>
                                <input type="password" className="form-control" id="InputPasswordCon" value={this.state.passwordConfirm} onChange={this.handleChangePasswordConfirm} />
                            </div>
                        </form>
                        </ModalBody>

                        <ModalFooter>
                            <input type="submit" value="Submit" color="success" className="btn btn-success" />
                            <Button color="danger" onClick={this.toggle}>Cancel</Button>
                        </ModalFooter>
                    </form>
                </Modal>
            </div>
        );
    }
}