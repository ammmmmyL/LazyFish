import React, { Component } from "react";
import { Redirect } from "react-router";

const userList = {};

class Admin {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }
}

userList["admin"] = new Admin("admin", "admin");

class ADLoginForm extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      loginStatus: "pending",
    };
    this.handleChangeUserName = this.handleChangeUserName.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e, userList) {
    e.preventDefault();
    const user = this.state.username;
    const pwd = this.state.password;
    if (user in userList) {
      if (userList[user].password === pwd) {
        this.setState({
          loginStatus: "success",
        });
        // Go to profile page
        console.log("go to profile");
      } else {
        this.setState({
          loginStatus: "error",
        });
        console.log("Password Error!");
      }
    } else {
      this.setState({
        loginStatus: "error",
      });
      console.log("User Not Found!");
    }
  }

  handleChangeUserName(e) {
    e.preventDefault();
    this.setState({ username: e.target.value });
  }

  handleChangePassword(e) {
    e.preventDefault();
    this.setState({ password: e.target.value });
  }

  render() {
    const { loginStatus } = this.state;
    if (loginStatus !== "success") {
      return (
        <React.Fragment>
          <div className="loginPage">
            <div id="login-form-container" className="credential">
              <form
                id="loginForm"
                className="loginForm text"
                onSubmit={(e) => {
                  this.handleSubmit(e, userList);
                }}>
                <input
                  id="username"
                  className="form-control login-element login-input"
                  type="text"
                  placeholder="Username"
                  onChange={this.handleChangeUserName}
                />
                <input
                  id="password"
                  className="form-control login-element login-input"
                  type="password"
                  placeholder="Password"
                  onChange={this.handleChangePassword}
                />
                <input
                  type="submit"
                  className="btn-primary login-element login-button"
                  value="Login"
                />
                {loginStatus === "error" ? (
                  <span className="login-warning">
                    Username or password error!
                  </span>
                ) : null}
              </form>
            </div>
          </div>
        </React.Fragment>
      );
    } else {
      return <Redirect to="/Admin/Dashboard" />;
    }
  }
}

export default ADLoginForm;
