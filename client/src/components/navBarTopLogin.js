import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'

import { Navbar, Nav, Form, FormControl, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import logo from "../img/logo.png";

import "./../css/navBar_style.css";

class NavBarTop extends React.Component {

    // Allows us to keep track of changing data in search bar.
    state = {
        search: ""
    };

    // Generic handler for whenever we type in search bar.
    handleInputChange = (event) => {
        const target = event.target
        const value = target.value

        console.log(value)
        this.setState({
            search: value
        });
    };

    render() {
        return (
            <div className="nav">
                <Navbar variant="light" expand="lg" sticky="top" id="navbar-container">
                    <div id="logo">
                        <img src={logo} alt="" />
                    </div>
                    <Form inline>
                        <FormControl value={this.state.search}
                            onChange={this.handleInputChange}
                            type="text"
                            placeholder="Search"
                            className="mr-sm-2" />
                        <Button variant="outline-light">Search</Button>
                    </Form>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ml-auto mt-2 mt-lg-0">
                            <Link className="nav-link" to="/">Home</Link>
                            <Link className="nav-link" to="/Login">Log in</Link>
                            <Link className="nav-link" to="/Login"><FontAwesomeIcon icon={faShoppingCart} /></Link>
                        </Nav>

                    </Navbar.Collapse>
                </Navbar>
            </div>
        )
    }
}

export default NavBarTop;