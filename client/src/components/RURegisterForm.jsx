import React, { Component } from "react";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import { user } from "./Objects";
import profilePic from "../img/SpongeBob.jpg";
import { checkSession, register } from "../actions/userActions";

class RURegisterForm extends Component {
  constructor() {
    super();
    this.state = {
      userLoggedIn: null,
      username: "",
      password: "",
      passwordCheck: "",
      registerStatus: "pending",
    };
    this.handleChangeUserName = this.handleChangeUserName.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleChangePasswordCheck = this.handleChangePasswordCheck.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit(e) {
    e.preventDefault();
    const user_name = this.state.username;
    const pwd = this.state.password;
    const pwdCheck = this.state.passwordCheck;
    if (user_name === "") {
      console.log("Empty username!");
      this.setState({ registerStatus: "invalid user name" });
    } else if (pwd !== pwdCheck || pwd === "") {
      console.log("Please double check your password!");
      this.setState({ registerStatus: "password check err" });
    } else {
      await register(user_name, pwd, this);
      console.log(this);
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
  handleChangePasswordCheck(e) {
    e.preventDefault();
    this.setState({ passwordCheck: e.target.value });
  }
  componentDidMount() {
    checkSession(this, this.props.mainComponent);
  }

  render() {
    const { registerStatus } = this.state;
    //const userList = Object.values(this.props.mainComponent.state.userList);
    if (this.state.userLoggedIn) {
      return <Redirect to="/Profile" />;
    }
    if (registerStatus !== "success") {
      return (
        <React.Fragment>
          <div class="bg-image"></div>
          <div className="container">
            <div className="loginPage">
              <div id="login-form-container" className="credential">
                <form
                  id="RegForm"
                  className="loginForm"
                  type="text"
                  onSubmit={(e) => {
                    this.handleSubmit(e);
                  }}>
                  <input
                    id="username"
                    className="form-control login-element login-input"
                    type="text"
                    placeholder="Username"
                    onChange={this.handleChangeUserName}
                  />
                  {registerStatus === "user exists" ? (
                    <span className="login-warning">
                      Username already exists!
                    </span>
                  ) : null}
                  {registerStatus === "invalid user name" ? (
                    <span>Cannot use empty user name!</span>
                  ) : null}
                  {registerStatus === "unknown error" ? (
                    <span>Unknown Error. Please try again later...</span>
                  ) : null}
                  <input
                    id="password"
                    className="form-control login-element login-input"
                    type="password"
                    placeholder="Password"
                    onChange={this.handleChangePassword}
                  />
                  <input
                    id="passwordCheck"
                    className="form-control login-element login-input"
                    type="password"
                    placeholder="Password"
                    onChange={this.handleChangePasswordCheck}
                  />
                  <input
                    type="submit"
                    className="btn-primary login-element login-button"
                    value="Register Now!"
                  />
                  {registerStatus === "password check err" ? (
                    <span className="login-warning">
                      Double check your password!
                    </span>
                  ) : null}
                  <div class="Reg">
                    <p>
                      Already have an account?{" "}
                      <Link to="/Login">
                        <div className="title_log">Login Here!</div>
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
            <div className="fixed-bottom">
              <footer className="footer">
                <div id="slogan">
                  <span>This is a website for camera lovers</span>
                </div>
              </footer>
            </div>
          </div>
        </React.Fragment>
      );
    } else {
      console.log(this.state);
      return <Redirect to="/RegistrationSuccess" />;
    }
  }
}

export default RURegisterForm;
