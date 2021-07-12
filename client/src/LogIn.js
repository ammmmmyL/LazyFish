import React from "react";
import RULoginForm from "./components/RULoginForm";
import "./css/RULogin_style.css";
// import "./css/ItemDetail_style.css";

class Login extends React.Component {
  render() {
    return (
      <React.Fragment>
        <RULoginForm mainComponent={this.props.mainComponent} />
      </React.Fragment>
    );
  }
}

export default Login;
