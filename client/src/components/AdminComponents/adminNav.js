import React from "react";
import { Nav } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import './../../css/adminNav_style.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { faChartBar } from '@fortawesome/free-solid-svg-icons'

import { userLogOut } from "./../../actions/userActions"

class adminNav extends React.Component {

    logOut = async () => {
        await userLogOut(this.props.mainComponent)
    }

    render() {
        return (
            <div className="navBars">
                <div className="col-md-12">
                    <Nav className="navbar navbar-dark fixed-top flex-md-nowrap p-0 shadow" id="header">
                        <a className="navbar-brand col-md-2 mr-0">Lazy Fish</a>
                        <ul className="navbar-nav px-3">
                            <li className="nav-item text-nowrap">
                                <Link className="nav-link"
                                    to="/Login"
                                    onClick={
                                        () => this.logOut()}
                                >
                                    Sign out
                                    </Link>
                            </li>
                        </ul>
                    </Nav>

                    <div className="sidenav">
                        <Link to="/Admin/Dashboard"><FontAwesomeIcon className="adminIcon" icon={faChartBar} /></Link>                       
                        <Link to="/Admin/Reports"><FontAwesomeIcon className="adminIcon" icon={faEdit} /></Link>
                    </div>
                </div>
            </div>
        )
    }
}

export default adminNav;
