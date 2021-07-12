import React, { Component } from "react";

import { BrowserRouter as Router, Switch } from "react-router-dom";

import Home from "./homepage";
import AboutUs from "./AboutUs";
import Profile from "./Profile";
import Login from "./LogIn";
import Register from "./components/RURegisterForm";
//import ADLogin from "./components/ADLoginForm";
import Dashboard from "./AdminDashboard";
import AllUser from "./components/AdminComponents/allUsers";
import AllItem from "./components/AdminComponents/allItems";
import MainContainer from "./components/ItemDetailsComponents";
import AddItem from "./components/addListing";
import ReportQueue from "./components/AdminComponents/reportQueue";
import ChangeNav from "./components/changeNav";
import RegistrationSuccess from "./components/RegistrationSuccess";
import ShoppingCart from "./Shopping_Cart";
import {
  userList,
  currentUser,
  currentItem,
  adminList,
  allReports,
  userType,
} from "./components/Data";

import ENV from './config.js'
const API_HOST = ENV.api_host

// const currentUser = userList[1];

class Main extends Component {
  constructor(props) {
      super(props);
      const url = `${API_HOST}/api/items`;
      const that = this;
      fetch(url)
          .then(res => {
              if (res.status === 200) {
                  //log("res:", res);
                  return res.json();
              } else {
                  alert("Could not get items");
              }
          })
          .then(function (temp) {
              //console.log("temp: ", temp)
              that.setState({
                  itemList: temp

              })
          })
  }

  // Mock User data and item data for phase 1
  // In phase 2 all data are fetched from server
  state = {
    //userList,
    itemList: null,
    currentUser,
    currentItem,
    //allReports,
    //adminList,
    userType,
  };

    componentDidUpdate(prevprops, prevstate, snapshot) {
        //console.log(prevstate)
        const url = `${API_HOST}/api/items`;
        const that = this;
        if (!this.state.itemList) {
            fetch(url)
                .then(res => {
                    if (res.status === 200) {
                        //log("res:", res);
                        return res.json();
                    } else {
                        alert("Could not get items");
                    }
                })
                .then(function (temp) {
                    console.log("temp: ", temp)
                    that.setState({
                        itemList: temp

                    })
                })
        }
        if (this.state.itemList && this.state.itemList.length == 0) {
            fetch(url)
                .then(res => {
                    if (res.status === 200) {
                        //log("res:", res);
                        return res.json();
                    } else {
                        alert("Could not get items");
                    }
                })
                .then(function (temp) {
                    console.log("temp: ", temp)
                    that.setState({
                        itemList: temp

                    })
                })
        }
    }
  render() {
    console.log("In Main.js");
    console.log("Main:",this);
    return (
      <div className="row pageContent">
        <div className="col-md-12">
          <Router>
            <div>
              <Switch>
                {/* RU Views*/}
                <ChangeNav
                  exact
                  path="/"
                  component={Home}
                  layout="userView"
                  items={this.state.itemList}
                  mainComponent={this}
                />
                <ChangeNav
                  exact
                  path="/Profile"
                  component={Profile}
                  layout="userView"
                  items={this.state.itemList}
                  mainComponent={this}
                />
                <ChangeNav
                  exact
                  path="/Profile/Add_item"
                  component={AddItem}
                  layout="userView"
                  items={this.state.itemList}
                  mainComponent={this}
                />
                <ChangeNav
                  exact
                  path="/Login"
                  component={Login}
                  layout="userView"
                  items={this.state.itemList}
                  mainComponent={this}
                />
                <ChangeNav
                    exact
                    path="/AboutUs"
                    component={AboutUs}
                    layout="userView"
                    items={this.state.itemList}
                    mainComponent={this}
                />
                <ChangeNav
                  exact
                  path="/Register"
                  component={Register}
                  layout="userView"
                  items={this.state.itemList}
                  mainComponent={this}
                />
                <ChangeNav
                  exact
                  path="/RegistrationSuccess"
                  component={RegistrationSuccess}
                  layout="userView"
                  items={this.state.itemList}
                  mainComponent={this}
                />
                <ChangeNav
                  exact
                  path="/Shopping_Cart"
                  component={ShoppingCart}
                  layout="userView"
                  items={this.state.itemList}
                  mainComponent={this}
                />
                <ChangeNav
                  exact
                  path="/Item_Listing"
                  component={MainContainer}
                  layout="userView"
                  items={this.state.itemList}
                  mainComponent={this}
                />

                {/* Admin Views*/}
                <ChangeNav
                  exact
                  path="/Admin/Dashboard"
                  component={Dashboard}
                  layout="adminView"
                  items={this.state.itemList}
                  mainComponent={this}
                />
                <ChangeNav
                  exact
                  path="/Admin/All_Users"
                  component={AllUser}
                  layout="adminView"
                  mainComponent={this}
                />
                <ChangeNav
                  exact
                  path="/Admin/All_Items"
                  component={AllItem}
                  layout="adminView"
                  mainComponent={this}
                />
                <ChangeNav
                  exact
                  path="/Admin/Reports"
                  component={ReportQueue}
                  layout="adminView"

                  mainComponent={this}
                />
              </Switch>
            </div>
          </Router>
        </div>
      </div>
    );
  }
}

export default Main;
