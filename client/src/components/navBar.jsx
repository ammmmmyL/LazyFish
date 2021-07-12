import React, { Component } from "react";
import logo from "../img/logo.png";
import { Navbar,Nav,NavDropdown,Form,FormControl,Button } from 'react-bootstrap'

class NavBar extends Component {
  render() {
    return (
      <React.Fragment>
        <div id="navbar-container">
          <nav className="navbar navbar-expand-lg navbar-light">
            <div id="logo">
              <img src={logo} />
            </div>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarTogglerDemo02"
              aria-controls="navbarTogglerDemo02"
              aria-expanded="false"
              aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
              <form className="form-inline my-2 my-lg-0">
                <input
                  className="form-control mr-sm-2"
                  type="search"
                  placeholder="Search"
                />
                <button
                  className="btn btn-outline-success my-2 my-sm-0"
                  type="submit">
                  Search
                </button>
              </form>
              <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
                <li className="nav-item">
                  <a className="nav-link" href="index.html">
                    Home
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Favorite
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Profile
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Log in
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    <i className="fas fa-address-card"></i>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    <i className="fas fa-shopping-cart"></i>
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </React.Fragment>
    );
  }
}

export default NavBar;
