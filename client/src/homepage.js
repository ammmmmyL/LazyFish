import React, { Component } from "react";
import { Link } from "react-router-dom";
import AliceCarousel from "react-alice-carousel";
import "./css/index.css";
import "./css/homePage_style.css";
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import "./css/navBar_style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { getAllItems } from "./actions/itemActions";
import ENV from './config.js'
const API_HOST = ENV.api_host


/*const env = process.env.NODE_ENV*/
//const API_HOST = ENV.api_host
//console.log('Current environment:', ENV.env)
const log = console.log;
class homepage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arr: [],
            //itemloaded: false,
        };
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
                    that.setState({
                        arr: temp,                       
                        //itemloaded: true
                    })
                    
                   
                })
        }
        log("state arr SET: ", this.state.arr)
        
    }

    handleClickOnItem = (e, item) => {        
        
        this.props.mainComponent.setState({
            currentItem: item,
        });
    };

    //handleGetAllItems = async (mainComponent) => {
    //    console.log("In handleGetAllItems");
    //    await this.getAllItems(mainComponent)
    //};

    
    componentDidMount() {
        //const currentUser = this.props.mainComponent.state.currentUser
        //console.log(currentUser)
        getAllItems(this)
        console.log("Did Mount", this)
        //this.timer = setInterval(() => getItems(this, this.state.currentUser), 5000);
    }

    componentDidUpdate(prevprops, prevstate) {
        
        if (this.props.mainComponent === undefined) {
            return
        }
        
        const itemlist = Object.values(this.props.mainComponent.state.itemList)
        
        if (this.props.mainComponent.state.itemList && this.state.arr && this.state.arr.length === itemlist.length) {
            log("itemlist", itemlist);
            log("state arr in Update: ", this.state.arr)
            return;
        }
        const arr = [];
        const currentUser = this.props.mainComponent.state.currentUser; 

        if (currentUser === null) {
            console.log("Null Current User");
            //console.log("HERE:", this.props.mainComponent.state.itemList[item_id])
            for (var item_id in this.props.mainComponent.state.itemList) {
               // console.log(this.props.mainComponent.state);
                if (
                    this.props.mainComponent.state.itemList[item_id].available &&
                    !this.props.mainComponent.state.itemList[item_id].deleted/* &&
                    !this.props.mainComponent.state.userList[
                        this.props.mainComponent.state.itemList[item_id].owner
                    ].banned*/
                ) {
                    arr.push(this.props.mainComponent.state.itemList[item_id]);
                }
            }
        } else {
            console.log("Valid Current User");
            for (item_id in this.props.mainComponent.state.itemList) {
                if (
                    this.props.mainComponent.state.itemList[item_id].available &&
                    !this.props.mainComponent.state.itemList[item_id].deleted /*&&
                    this.props.mainComponent.state.itemList[item_id].owner !==
                    currentUser.user_id*/
                ) {
                    arr.push(this.props.mainComponent.state.itemList[item_id]);
                }
            }
        }
        log("arr: ", arr)
        log("state arr after Arr push: ", this.state.arr)
        if (arr.length == 0 && this.state.arr.length == 0) {
            return;
        }
        if (arr.length === 0 || arr.length !== this.state.arr.length) {
            //console.log(arr, this.state.arr)
            //this.itemloaded = false;
            this.setState({ arr })
        }
       
        
    }

    render() {
        
        log("state arr in Render: ", this.state.arr)
        
        if (this.state.arr != undefined) {

            return (
                //Title goes here; slider pictures, posts go here
                <div className="pageContent">
                    <header>
                        <div className="overlay">
                            <video playsInline="playsInline" autoPlay="autoPlay" muted="muted" loop="loop"
                                source src={"https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4"} type="video/mp4" />

                            <div className="container h-100">
                                <div className="d-flex h-100 text-center align-items-center">
                                    <div className="w-100 text-white">
                                        <h1 className="display-3">Welcome to <Link to="AboutUs"><span className="title_head">LazyFish</span></Link></h1>
                                        <p className="lead mb-0">Your best place for a loved camera  <span>&#9825;</span></p>
                                        <a href="#row3">
                                            <span className="title_smaller">Start Exploring Here</span>
                                        </a>


                                        

                                        {/*<span class="BtnAction__icon__3-znqAs5"><span class="Icon__icon__2tdLhZ5T Icon__icon--border__3nsmYcwT Icon__bgtransparent__2DiBPCjn"><span class="Icon__over-circle__1opWzs6L"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" stroke="1" style=""></circle></svg></span><svg viewBox="0 0 8 16" class="icon" width="8" height="16" xmlns="http://www.w3.org/2000/svg" style="height: 16px; width: 8px;"><path d="M7.268 9.547L0 16l4-8-4-8 7.268 6.453C7.715 6.82 8 7.377 8 8c0 .623-.285 1.18-.732 1.547z"></path></svg></span></span>*/}
                                    </div>
                                </div>
                                    </div>

                            {/*<div className="title_text">Welcome to LazyFish</div>*/}
                            {/*<div className="title_small">Your best place to find a loved camera</div>*/}
                            {/*<div className="title_smaller">Start the journry to see our featured products! <span>&#8605;</span></div>*/}

                            {/*<div className="carouselSlide">*/}
                            {/*    <AliceCarousel*/}
                            {/*        disableSlideInfo="false"*/}
                            {/*        autoPlay*/}
                            {/*        autoPlayInterval="2500"*/}
                            {/*        infinite="true"*/}
                            {/*        disableButtonsControls="true">*/}
                            {/*        {this.state.arr.map((item, item_id) => {*/}
                            {/*            return (*/}
                            {/*                <div className="array" key={item_id}>*/}
                            {/*                    {this.props.mainComponent.state.currentUser !== null ? (*/}
                            {/*                        <Link*/}
                            {/*                            to="/Item_Listing"*/}
                            {/*                            onClick={(e) => this.handleClickOnItem(e, item)}>*/}
                            {/*                            <div className="cameraListing">*/}
                            {/*                                <img src={item.pictures[0]} alt="banner" />*/}
                            {/*                            </div>*/}
                            {/*                        </Link>*/}
                            {/*                    ) : (*/}
                            {/*                            <Link to="/Login">*/}
                            {/*                                <div className="cameraListing">*/}
                            {/*                                    <img src={item.pictures[0]} alt="banner" />*/}
                            {/*                                </div>*/}
                            {/*                            </Link>*/}
                            {/*                        )}*/}
                            {/*                    <h2>*/}
                            {/*                        <span>{item.item_name}</span>*/}
                            {/*                    </h2>*/}
                            {/*                </div>*/}
                            {/*            );*/}
                            {/*        })}*/}
                            {/*    </AliceCarousel>*/}
                            {/*</div>*/}
                            {/*<div className="buttonP">*/}
                            {/*    <a href="#row3">*/}
                            {/*        <button className="buttonHomepage">I Want to See All</button>*/}
                            {/*    </a>*/}
                            {/*</div>*/}
                        </div>
                    </header>
                    <div className="container">
                        {/*<div className="row">*/}
                        {/*    <div className="column left">*/}
                                                              
                        {/*    </div>*/}
                        {/*</div>*/}

                        <div className="row">

                            <div className="row3" id="row3">
                                <div className="title_small">All Products:</div>
                            </div>
                            {this.state.arr.map((item, item_id) => {
                                return (
                                    <div className="array" key={item_id}>
                                        {this.props.mainComponent.state.currentUser !== null ? (
                                            <Link
                                                to="/Item_Listing"
                                                onClick={(e) => this.handleClickOnItem(e, item)}>
                                                <div className="cameraListing">
                                                    <img src={item.pictures[0]} alt="banner" />
                                                </div>
                                            </Link>
                                        ) : (
                                                <Link to="/Login">
                                                    <div className="cameraListing">
                                                        <img src={item.pictures[0]} alt="banner" />
                                                    </div>
                                                </Link>
                                            )}
                                        <h6>{item.item_name}</h6>
                                        <span className="checked">
                                            <FontAwesomeIcon icon={faStar} />
                                        </span>
                                        <span className="checked">
                                            <FontAwesomeIcon icon={faStar} />
                                        </span>
                                        <span className="checked">
                                            <FontAwesomeIcon icon={faStar} />
                                        </span>
                                        <span>
                                            <FontAwesomeIcon icon={faStar} />
                                        </span>
                                        <span>
                                            <FontAwesomeIcon icon={faStar} />
                                        </span>
                                        <h6>${item.price}</h6>
                                    </div>
                                );
                            })}
                        </div>

                        <br />
                        <br />
                        <br />
                        <div className="fixed-bottom">
                            <footer className="footer">
                                <div id="slogan">
                                    <span>This is a website for camera lovers.  </span>
                                    <Link to="AboutUs"><span className="title_smallest">About Us</span></Link>
                                </div>
                            </footer>
                        </div>
                    </div>
                </div>
            );
        } else {
            return <div>Page loading...</div>
        }
            
        }
    }

export default homepage;
