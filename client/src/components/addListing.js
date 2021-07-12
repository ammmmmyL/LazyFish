import React from 'react'
import {
    Form, Col,
    Button,
} from 'react-bootstrap'
import { Link, Redirect } from 'react-router-dom';
import '../css/profile_style.css'
import p1 from "../img/homepage/p1.jpg";
import p2 from "../img/homepage/p2.jpg";
import p3 from "../img/homepage/p3.jpg";
import p4 from "../img/homepage/p4.jpg";
import { item } from "./Objects";
// Importing actions/required methods
import { addItem, getAllItemsNum } from "../actions/itemActions";
import { checkSession } from "./../actions/userActions";

class AddItem extends React.Component {

    state = {
        // check session
        userLoggedIn: null,
        // input values
        item_name: "",
        price: "",
        description: "",
        pictures: [],
        // if item added successfully
        itemAdded: false,
        itemStatus: "",
        // states from main
        main: this.props.mainComponent,
        currentUser: this.props.mainComponent.state.currentUser,
        itemList: [],
    }

    // get current number of items from database for add_listing function
    async componentDidMount() {
        await checkSession(this, this.props.mainComponent);
        await getAllItemsNum(this)
    }

    // Generic handler for whenever we type in search bar.
    handleInputChange = (event) => {
        const target = event.target
        const value = target.value
        const name = target.name

        //console.log(value)
        this.setState({
            [name]: value
        });
    };

    addItemtoUser = async (currentUser) => {
        console.log("In addItemtoUser");
        //console.log(this.state)
        //console.log(parseFloat(this.state.price))
        //console.log(typeof this.state.price)

        // check input validity
        // item name: string
        if ((typeof this.state.item_name !== 'string') ||
            (this.state.item_name === "")) {
            this.setState({
                itemStatus: "Listing Name can't be empty"
            })
        }

        // price: number
        else if ((parseFloat(this.state.price) != this.state.price) ||
            (this.state.price === "")) {
            this.setState({
                itemStatus: "Price can't be empty"
            })
        }

        // description: string
        else if ((typeof this.state.description !== 'string') ||
            (this.state.description === "")) {
            this.setState({
                itemStatus: "Description can't be empty"
            })
        }

        // *not checked*
        // pictures: string
        //if (this.state.pictures === "") {
        //    this.setState({
        //        itemStatus: "Item name must be a string"
        //    })
        //}

        // add the item is all input fields are correct
        else if (this.state.itemStatus === "") {
            // console.log("valid item")
            // create a new item
            const item_id = this.state.itemList + 1
            const newItem = new item(
                item_id,
                this.state.item_name,
                currentUser.user_id,
                // hardcode images
                [p1, p2, p3, p4],
                //this.state.pictures,
                this.state.description,
                this.state.price,
                true,
                [],
                false
            );

            // add new item to itemList
            // console.log(newItem)
            await addItem(this, newItem, currentUser)
        }
    };

    render() {

        console.log("In addListing.js");
        const currentUser = this.props.mainComponent.state.currentUser
        const profilePage = this
        //console.log(profilePage)
        /*console.log(currentUser)*/

        return this.state.userLoggedIn === true ? (
            <div id="main-container" className="container">
            <div className="itemForm">
                <div className="container">
                    <Form>
                        <Form.Group>
                            <Form.Row>
                                <Form.Label column="lg" lg={2}>
                                    Listing Name
                                </Form.Label>
                                <Col>
                                    <Form.Control
                                        size="lg"
                                        type="text"
                                        placeholder="Enter Listing Name"
                                        name="item_name"
                                        value={this.state.item_name}
                                        onChange={this.handleInputChange}
                                    />
                                </Col>
                            </Form.Row>
                            <br />
                                <Form.Row>
                                    <Form.Label column="lg" lg={2}>
                                        Price
                                </Form.Label>
                                    <Col>
                                        <Form.Control
                                            size="lg"
                                            type="number"
                                            placeholder="Enter Price"
                                            name="price"
                                            value={parseFloat(this.state.price)}
                                            onChange={this.handleInputChange}
                                        />
                                    </Col>
                                </Form.Row>
                            <br />
                            <Form.Row>
                                <Form.Label column="lg" lg={2}>
                                    Description
                                </Form.Label>
                                <Col>
                                    <Form.Control as="textarea" rows={5}
                                            name="description"
                                            size="lg"
                                            type="text"
                                            placeholder="Enter Listing Name"
                                        value={this.state.description}
                                        onChange={this.handleInputChange}
                                    />
                                </Col>
                            </Form.Row>
                            <br />
                            <Form.Row className="test">
                                <Form.Label column="lg" lg={2}>
                                    Upload Pictures
                                </Form.Label>
                                <Col className="uploadButton">
                                    <Form.File
                                        size="lg"
                                        id="exampleFormControlFile1"
                                        name="pictures"
                                        value={this.state.pictures}
                                        onChange={this.handleInputChange}
                                    />
                                </Col>
                            </Form.Row>
                        </Form.Group>
                        <br />
                        <Button
                            id="submitButton"
                            onClick={
                                () => this.addItemtoUser(currentUser)}
                        >
                            Add
                        </Button>
                            {this.state.itemAdded === false ? (
                                <div className="dashboard_error">{this.state.itemStatus}</div>
                            ) : (
                                    <div>
                                        <div className="dashboard_success">{this.state.itemStatus}</div>
                                        <Link to="/Profile">
                                            <div>Return to profile page</div>
                                        </Link>
                                    </div>
                                )}
                    </Form>
                </div>
                <div className="fixed-bottom">
                    <footer className="footer">
                        <div id="slogan">
                            <span>This is a website for camera lovers</span>
                        </div>
                    </footer>
                </div>
            </div >
            </div>
        ) : this.state.userLoggedIn === null ? (
            <div></div>
        ) : (
                    <Redirect to="/Login" />
                );
    }
}

export default AddItem;