import React, { Component } from 'react';
import { Navbar, Nav, Form, FormControl, Button } from 'react-bootstrap';

export default class Navigation extends Component {
    render() {
        return (
            <>
                <Navbar bg="primary" variant="dark">
                    <Navbar.Brand href="/">
                        <img
                            alt=""
                            src="/gameboy-logo.png"
                            width="25"
                            className="d-inline-block align-top"
                        />{' '}
                        Test ME
                    </Navbar.Brand>
                    <Nav className="ml-auto">
                        <Nav.Link href="/tests">Tesztjeim</Nav.Link>
                        <Nav.Link href="/maketests">Teszt készítése</Nav.Link>
                        <Nav.Link href="/auth">Bejelentkezés</Nav.Link>
                    </Nav>
                </Navbar>
            </>
        );
    }
};