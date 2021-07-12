import React, { Component } from "react";
import { Link } from 'react-router-dom';

class RegistrationSuccess extends Component {
    render() {
        return (
            <div className="loginPage">
                <div id="RegistrationSuccessMsg">
                    Thanks for your registration! Please 
                    <Link to="/Login"> Login again</Link>
                </div>
            </div>
        );
    }
}

export default RegistrationSuccess;
