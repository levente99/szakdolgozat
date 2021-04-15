import React, { Component } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import configData from '../../config.json';

interface NavigationProps {
    renderNav: boolean;
}

interface NavigationState {
    loggedIn: boolean;
    redirect: boolean;
}

export default class Navigation extends Component<NavigationProps, NavigationState> {

    constructor(props: NavigationProps) {
        super(props);
        this.state = {
            loggedIn: true,
            redirect: false
        }
    }

    async componentDidMount() {
        await this.fetchSession().then((sessionRes) => {
            sessionRes == "" ? this.setState({ loggedIn: false }) : this.setState({ loggedIn: true });
        })
    }

    render() {
        if (this.state.redirect) {
            return <Redirect push to="/auth" />
        }
        return (
            this.props.renderNav ?
                <Navbar bg="primary" variant="dark">
                    <Navbar.Brand href="/">
                        <img
                            alt=""
                            src="/gameboy-logo.png"
                            width="40"
                            className="d-inline-block align-center"
                        />{' '}
                        Test ME
                    </Navbar.Brand>
                    <Nav className="ml-auto">

                        {this.state.loggedIn ?
                            <>
                                <Nav.Link href="/tests">Tesztjeim</Nav.Link>
                                <Nav.Link href="/create">Teszt készítése</Nav.Link>
                                <img src="/img/exit.svg" onClick={this.callLogout} style={{ width: 40, marginLeft: 7, cursor: 'pointer' }} />
                            </> :
                            <Nav.Link href="/auth">Bejelentkezés</Nav.Link>}
                    </Nav>
                </Navbar> : null
        );
    }

    callLogout = () => {
        fetch(`${configData.SERVER_URL}/logout`, { method: 'POST' })
            .then(() => {
                document.cookie = ".AspNetCore.Session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                this.setState({ loggedIn: false, redirect: true });
            });
    }

    fetchSession = async () => {
        let sessionRes: string | undefined;
        await fetch(`${configData.SERVER_URL}/users/fetch-from-session`, { method: 'GET', credentials: 'include' })
            .then(function (body) {
                return body.text();
            }).then((response) => {
                if (response)
                    sessionRes = response;
            });
        return sessionRes;
    }
};