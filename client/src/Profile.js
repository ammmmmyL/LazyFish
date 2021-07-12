import React from "react";
import { Link, Redirect } from 'react-router-dom';

import './css/profile_style.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'

// Importing actions/required methods
import { getItems } from "./actions/itemActions";
import { checkSession } from "./actions/userActions";

import itemHolder from "./img/homepage/p1.jpg"
import p2 from "./img/homepage/p2.jpg"
import p3 from "./img/homepage/p3.jpg"
import p4 from "./img/homepage/p4.jpg"
import profilePicHolder from "./img/profileHolder.png"
import addItem from "./img/addItem.png"

class Profile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userLoggedIn: null,
            currentUser: this.props.mainComponent.state.currentUser,
            item_to_display: [],
            item_sold: [],
        }
    }

    async componentDidMount() {
        await checkSession(this, this.props.mainComponent);
        await getItems(this, this.state.currentUser)      
    }

    componentWillUnmount() {
        clearInterval(this.timer);
        this.timer = null;
    }

    handleClickOnItem = (e, item) => {
        //console.log("In HandleClickOnItem");
        this.props.mainComponent.setState({
            currentItem: item,
        });
    };

    render() {
        console.log("in Profile")

        if (this.state.itemAdded === true) {
            getItems(this, this.state.currentUser)
            this.setState({
                itemAdded: false
            })
        }

        const currentUser = this.props.mainComponent.state.currentUser
        //console.log(this.state.item_to_display)
        //console.log(currentUser.profilePic)

        return this.state.userLoggedIn === true ? (
            <React.Fragment>
                <div className="profileBody">
                    <div id="main-container" className="container">
                        <div className="container">
                            <div className="transparentbox-profile">
                                <div className="row">
                                    <div className="col-sm-4" id="profilePic">
                                        {/*<h3>Profile Picture</h3>*/}
                                        {currentUser.profilePic.length === 0 ?
                                            (<img src={profilePicHolder} alt="profileHolder" />) :
                                            (<img src={currentUser.profilePic} alt="profile" />)
                                        }

                                    </div>

                                    <div className="col-sm-8" id="profileInfo">
                                        <h2>Name: {currentUser.user_name}</h2>
                                        <div className="row rating">
                                        <strong>Rating: </strong>
                                        {currentUser.credit_point >= 5 ? (
                                            <div>
                                                <span className="checked"><FontAwesomeIcon icon={faStar} /></span>
                                                <span className="checked"><FontAwesomeIcon icon={faStar} /></span>
                                                <span className="checked"><FontAwesomeIcon icon={faStar} /></span>
                                                <span className="checked"><FontAwesomeIcon icon={faStar} /></span>
                                                <span className="checked"><FontAwesomeIcon icon={faStar} /></span>
                                            </div>
                                        ) : currentUser.credit_point === 4 ? (
                                            <div>
                                                <span className="checked"><FontAwesomeIcon icon={faStar} /></span>
                                                <span className="checked"><FontAwesomeIcon icon={faStar} /></span>
                                                <span className="checked"><FontAwesomeIcon icon={faStar} /></span>
                                                <span className="checked"><FontAwesomeIcon icon={faStar} /></span>
                                                <span><FontAwesomeIcon icon={faStar} /></span>
                                            </div>
                                        ) : currentUser.credit_point === 3 ? (
                                            <div>
                                                <span className="checked"><FontAwesomeIcon icon={faStar} /></span>
                                                <span className="checked"><FontAwesomeIcon icon={faStar} /></span>
                                                <span className="checked"><FontAwesomeIcon icon={faStar} /></span>
                                                <span><FontAwesomeIcon icon={faStar} /></span>
                                                <span><FontAwesomeIcon icon={faStar} /></span>
                                            </div>
                                        ) : currentUser.credit_point === 2 ? (
                                            <div>
                                                <span className="checked"><FontAwesomeIcon icon={faStar} /></span>
                                                <span className="checked"><FontAwesomeIcon icon={faStar} /></span>
                                                <span><FontAwesomeIcon icon={faStar} /></span>
                                                <span><FontAwesomeIcon icon={faStar} /></span>
                                                <span><FontAwesomeIcon icon={faStar} /></span>
                                            </div>
                                        ) : currentUser.credit_point === 1 ? (
                                            <div>
                                                <span className="checked"><FontAwesomeIcon icon={faStar} /></span>
                                                <span><FontAwesomeIcon icon={faStar} /></span>
                                                <span><FontAwesomeIcon icon={faStar} /></span>
                                                <span><FontAwesomeIcon icon={faStar} /></span>
                                                <span><FontAwesomeIcon icon={faStar} /></span>
                                            </div>
                                        ) : (
                                                                <div>
                                                                    <span><FontAwesomeIcon icon={faStar} /></span>
                                                                    <span><FontAwesomeIcon icon={faStar} /></span>
                                                                    <span><FontAwesomeIcon icon={faStar} /></span>
                                                                    <span><FontAwesomeIcon icon={faStar} /></span>
                                                                    <span><FontAwesomeIcon icon={faStar} /></span>
                                                                </div>
                                                                )}
                                        </div>
                                        <br />
                                        <br />
                                        <br />
                                        <div className="favorites">Your Loves <span>&#9825;:</span></div>
                                        <div className="row">
                                            <div className="col">
                                                <img className="item" src={itemHolder} alt="item" />
                                            </div>
                                            <div className="col">
                                                <img className="item" src={p2} alt="item" />
                                            </div>
                                            <div className="col">
                                                <img className="item" src={p3} alt="item" />
                                            </div>
                                            <div className="col">
                                                <img className="item" src={p4} alt="item" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <br />
                        <div className="container break"><hr /></div>
                        <div className="container" id="userListings">
                            <div className="transparentbox-profile">
                                <div className="row">
                                    <div className="col-sm-3">
                                        <h1>All Listings</h1>
                                    </div>
                                    <div className="col">

                                        <div className="row">

                                            {this.state.item_to_display.map((item) => {
                                                return (
                                                    <div className="col">
                                                        <Link to="/Item_Listing"
                                                            onClick={(e) => this.handleClickOnItem(e, item)}
                                                        >
                                                            {item.pictures.length === 0 ?
                                                                (<img className="item" src={itemHolder} alt="item" />) :
                                                                (<img className="item" src={item.pictures[0]} alt="item" />)
                                                            }                                                      
                                                        </Link>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        <div className="row">
                                            <div>
                                                <Link to="/Profile/Add_item">
                                                    {/*    onClick={(e) => this.handleAddItem(e)}*/}
                                                    {/*>*/}
                                                    <div className="col">
                                                        <img className="add_listing" src={addItem} alt="item" />
                                                        <p>Add New Listing</p>
                                                    </div>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="container"><hr className="break" /></div>
                        <div className="container" id="userListings">
                            <div className="transparentbox-profile">
                                <div className="row">
                                    <div className="col-sm-3">
                                        <h1>Sold Listings</h1>
                                    </div>
                                    <div className="col">

                                        <div className="row">

                                            {this.state.item_sold.map((item) => {
                                                return (
                                                    <div className="col">
                                                        <Link to="/Item_Listing"
                                                            onClick={(e) => this.handleClickOnItem(e, item)}
                                                        >
                                                            <img className="item" src={item.pictures[0]} alt="item" />
                                                        </Link>
                                                    </div>
                                                )
                                            })}
                                        </div>
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
                </div>
            </React.Fragment>
        ) : this.state.userLoggedIn === null ? (
            <div></div>
        ) : (
                    <Redirect to="/Login" />
                );
    }
}

export default Profile;