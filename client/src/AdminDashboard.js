import React from "react";
import { Link, Redirect } from 'react-router-dom';
import './css/dashboard_style.css'
import { getAllUsers, getAllItems, getAllReports } from "./actions/adminActions"
import { checkSession } from "./actions/userActions";

class dashboard extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        userList: [],
        itemList: [],
        reportList: []
    }

    componentDidMount() {
        /*await checkSession(this, this.props.mainComponent);*/
        getAllUsers(this);
        getAllItems(this);
        getAllReports(this)
    }

    render() {
        console.log("In admin dashboard")
        console.log(this.state)
        const listingNum = this.state.itemList.length
        const userNum = this.state.userList.length
        const reportNum = this.state.reportList.length

        return (
            <React.Fragment>
                <div className="container" id="admin-main">
                    <div className="row topStats">
                        <div className="col">
                            <div className="row AdminStats">
                                <div className="col-9">
                                    <h1><Link to="/Admin/All_Users">Total Users</Link></h1>

                                </div>
                                <div className="col-3 statsNum">
                                    <h2>{userNum}</h2>
                                </div>
                            </div>
                            <div className="row AdminStats">
                                <div className="col-9">
                                    <h1><Link to="/Admin/All_Items">Total Listings</Link></h1>
                                    
                                </div>
                                <div className="col-3 statsNum">
                                    <h2>{listingNum}</h2>
                                </div>

                            </div>
                            <div className="row AdminStats">
                                <div className="col-9">
                                    <h1><Link to="/Admin/Reports">New Reports</Link></h1>
                                   
                                </div>
                                <div className="col-3 statsNum">
                                    <h2>{reportNum}</h2>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="fixed-bottom">
                    <footer className="footer">
                        <div id="slogan">
                            <span>This is a website for camera lovers</span>
                        </div>
                    </footer>
                </div>
            </React.Fragment>
        );
    }
}

export default dashboard;