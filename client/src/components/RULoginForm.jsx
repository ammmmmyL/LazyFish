import React, { Component } from "react";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import { checkSession, login } from "../actions/userActions";
import "../css/index.css";
import logo from "../img/logo.png";

class RULoginForm extends Component {
  constructor() {
    super();
    this.state = {
      userLoggedIn: null,
      username: "",
      password: "",
      loginStatus: "pending",
    };
    this.handleChangeUserName = this.handleChangeUserName.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    console.log("In handleSubmit");
    const mainComponent = this.props.mainComponent;
    const user = this.state.username;
    const pwd = this.state.password;
    await login(user, pwd, this, mainComponent);

    // if (user === "admin") {
    //   if (pwd !== "admin") {
    //     console.log("Password Error!");
    //     this.setState({ loginStatus: "error" });
    //   } else {
    //     this.setState({ loginStatus: "success" });
    //     console.log("Admin List:");
    //     console.log(this.props.mainComponent.state.adminList);
    //     // mainComponent.setState({
    //     //   currentUser: this.props.mainComponent.state.adminList[1],
    //     //   userType: "admin",
    //     // });
    //   }
    //   return;
    // }

    // const targetUserObjectList = userList.filter((u) => u.user_name === user);

    // if (targetUserObjectList.length === 1) {
    //   if (targetUserObjectList[0].password == pwd) {
    //     console.log("go to profile");

    //     const currentUser = targetUserObjectList[0];
    //     if (currentUser.banned === true) {
    //       this.setState({
    //         loginStatus: "banned",
    //       });
    //     } else {
    //       this.setState({ loginStatus: "success" });
    //     }
    //   } else {
    //     console.log("Password Error!");
    //     this.setState({ loginStatus: "error" });
    //   }
    // } else {
    //   console.log("User Not Found!");
    //   this.setState({ loginStatus: "error" });
    // }
  };

  handleChangeUserName(e) {
    e.preventDefault();
    this.setState({ username: e.target.value });
  }

  handleChangePassword(e) {
    e.preventDefault();
    this.setState({ password: e.target.value });
  }

  componentDidMount() {
    checkSession(this, this.props.mainComponent);
  }

  render() {
    console.log(this.state.loginStatus);
    const { userName, password, loginStatus } = this.state;
    if (this.state.userLoggedIn) {
      return <Redirect to="/Profile" />;
    }
    if (loginStatus !== "success") {
      return (
        <React.Fragment>
          <div class="bg-image"></div>
          <div className="container">
            {/*<div className="pageContent">*/}
            <div className="loginPage">
              <div id="login-form-container" className="credential">
                <div class="imgcontainer">
                  <img src={logo} alt="Avatar" class="avatar" />
                </div>
                <form
                  id="loginForm"
                  className="loginForm"
                  type="text"
                  onSubmit={(e) => {
                    this.handleSubmit(e);
                  }}>
                  <input
                    id="username"
                    className="form-control login-element login-input"
                    type="text"
                    value={userName}
                    placeholder="Username"
                    onChange={this.handleChangeUserName}
                  />
                  <input
                    id="password"
                    className="form-control login-element login-input"
                    type="password"
                    value={password}
                    placeholder="Password"
                    onChange={this.handleChangePassword}
                  />
                  <input
                    type="submit"
                    className="btn-primary login-element login-button"
                    value="Log in"
                  />
                  {loginStatus === "error" ? (
                    <div className="login-warning">
                      Username or password is incorrect!
                    </div>
                  ) : null}
                  {loginStatus === "banned" ? (
                    <span className="login-warning">
                      You are banned by the administrator!
                    </span>
                  ) : null}
                  <div class="Reg">
                    New to LazyFish?{" "}
                    <Link to="/Register">
                      <div className="title_log">Register Now!</div>
                    </Link>
                  </div>
                </form>
              </div>
              <div className="fixed-bottom">
                <footer className="footer">
                  <div id="slogan">
                    <span>This is a website for camera lovers</span>
                  </div>
                </footer>
              </div>
            </div>
            {/*</div>*/}
          </div>
        </React.Fragment>
      );
    } else {
      if (this.props.mainComponent.state.userType === "regular") {
        return <Redirect to="/Profile" />;
      } else {
        return <Redirect to="/Admin/Dashboard" />;
      }
    }
  }
}

export default RULoginForm;
