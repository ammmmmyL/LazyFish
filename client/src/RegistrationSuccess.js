import React, { Component } from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.css";
import RegistrationSuccess from "./components/RegistrationSuccess";
import NavBar from "./components/navBar";
import "./css/RULogin_style.css";
import "./css/RegistrationSuccess.css";

ReactDOM.render(
  <React.Fragment>
    <RegistrationSuccess />
  </React.Fragment>,
  document.getElementById("root")
);
