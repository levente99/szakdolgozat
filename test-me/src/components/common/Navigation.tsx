import React, { Component } from 'react';
import { Navbar, Nav, Form, FormControl, Button } from 'react-bootstrap';

export default class Navigation extends Component {
    render() {
        return (
            <>
                <Navbar bg="primary" variant="dark">
                    <Navbar.Brand href="/">TestME</Navbar.Brand>
                    <Nav className="ml-auto">
                        <Nav.Link href="/tests">Tesztjeim</Nav.Link>
                        <Nav.Link href="/maketests">Teszt készítése</Nav.Link>
                    </Nav>
                </Navbar>
            </>
        );
    }
};