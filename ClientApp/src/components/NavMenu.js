import React, { Component } from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';
import { ModalComponent } from './ModalComponent';
import { ModalLogIn } from './ModalLogIn';
import { FilmsList } from './FilmsList';
import { FilmsListForUser } from './FilmsListForUser';
import { FilmsListBegin } from './FilmsListBegin';
import { MyTickets } from './MyTickets';

export class NavMenu extends Component {
    static displayName = NavMenu.name;

    constructor(props) {
        super(props);

        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.state = {
            collapsed: true
        };
    }

    toggleNavbar() {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    render() {
        return (
            <header>
                <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" light>
                    <Container>
                        <NavbarBrand tag={Link} to="/home">Kinoteatr</NavbarBrand>
                        <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
                        <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
                            <ul className="navbar-nav flex-grow">
                                {/*<NavItem>*/}
                                {/*    <NavLink tag={Link} className="text-dark" to="/">Home</NavLink>*/}
                                {/*</NavItem>*/}
                                {/*<NavItem>*/}
                                {/*    <NavLink tag={Link} className="text-dark" to="/counter">Counter</NavLink>*/}
                                {/*</NavItem>*/}
                                {/*<NavItem>*/}
                                {/*    <NavLink tag={Link} className="text-dark" to="/fetch-data">Fetch data</NavLink>*/}
                                {/*</NavItem>*/}
                                <LoginButton />
                            </ul>
                        </Collapse>
                    </Container>
                </Navbar>
            </header>
        );
    }
}

class LoginButton extends Component {

    constructor(props) {
        super(props);

        this.state = {
        };

        this.onClick = this.onClick.bind(this);
        this.CheckRole = this.CheckRole.bind(this);
    }

    CheckRole() {
        var url = "/api/Account/isAuthenticated";
        var xhr = new XMLHttpRequest();
        xhr.open("post", url, true);
        xhr.onload = function () {
            var data = JSON.parse(xhr.responseText);
            this.setState({ role: data.role });
            //window.location.reload();
        }.bind(this);
        xhr.send();
        this.forceUpdate();
        //window.location.reload();
    }

    //componentDidUpdate() {
    //    var elem = document.getElementById('myList');
    //    if (elem) {
    //        if (this.state.role === "admin")
    //            elem.innerHTML = '<FilmsList apiUrl="/api/films" />';
    //        else
    //            if (this.state.role === "user")
    //                elem.innerHTML = '<FilmsListForUser apiUrl="/api/films" />';
    //            else elem.innerHTML = '<FilmsListBegin apiUrl="/api/films" />';
    //    }
    //}

    componentDidMount() {
        this.CheckRole();
    }

    onClick(e) {
        var url = "/api/Account/LogOff";
        var xhr = new XMLHttpRequest();
        xhr.open("post", url, true);
        xhr.onload = function () {
            var data = JSON.parse(xhr.responseText);
        }.bind(this);
        xhr.send();
        this.CheckRole();
        window.location.reload();
    }

    render() {
        var roles = this.CheckRole;
        if (this.state.role == "")
            return (
                <>
                    <NavItem>
                        {/*<NavLink tag={Link} className="text-dark" to="/login">¬ход</NavLink>*/}
                        <ModalLogIn onCheck={roles} />
                    </NavItem>
                    <NavItem>
                        <ModalComponent onCheck={roles} />
                    </NavItem>
                </>
            );
        else if (this.state.role == "admin")
            return (
                <NavItem>
                    <Button color="danger" onClick={this.onClick}>Log Out</Button>
                </NavItem>
            );
        else
            return (
                <>
                    <NavItem>
                        <NavLink tag={Link} className="text-dark" to="/myTickets">My tickets</NavLink>
                    </NavItem>
                    <NavItem>
                        <Button color="danger" onClick={this.onClick}>Log Out</Button>
                    </NavItem>
                </>
            
        );
    }
}