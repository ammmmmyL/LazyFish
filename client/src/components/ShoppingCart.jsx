import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { getCartItems } from "../actions/itemActions";
import {
  buyItemInCart,
  deleteItemInCart,
  checkSession,
} from "../actions/userActions";

class CartItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataLoaded: false,
      mainComponent: this.props.mainComponent,
      currentUser: this.props.currentUser,
      itemList: [],
    };
  }

  componentDidMount() {
    console.log("Main component in cart items: ");
    console.log(this.props.mainComponent.state);
    getCartItems(this.props.mainComponent.state.currentUser._id, this);
  }

  handleBuy = async (e, item) => {
    e.preventDefault();
    console.log("In handleBuy");
    console.log(this.props.mainComponent);
    await buyItemInCart(
      this.props.mainComponent.state.currentUser._id,
      item._id
    );
    await getCartItems(this.props.mainComponent.state.currentUser._id, this);
  };

  handleDelete = async (e, item) => {
    e.preventDefault();
    await deleteItemInCart(
      this.props.mainComponent.state.currentUser._id,
      item._id,
      this.props.mainComponent
    );
    await getCartItems(this.props.mainComponent.state.currentUser._id, this);
    // console.log(item);
    // const currentUserTemp = this.state.currentUser;
    // currentUserTemp.cart = currentUserTemp.cart.filter(
    //   (itemId) => itemId != item
    // );
    // this.setState({
    //   currentUser: currentUserTemp,
    // });
    // this.props.mainComponent.setState({
    //   currentUser: currentUserTemp,
    // });
  };

  handleCheckItem = (e, item) => {
    this.props.mainComponent.setState({
      // currentItem: this.props.mainComponent.state.itemList[item_id],
      currentItem: item,
    });
  };

  render() {
    console.log("in CartItems");
    // console.log(this.state.mainComponent);
    console.log(this.state.itemList);
    // const mainComponent = this.props.mainComponent;
    // const userList = this.state.mainComponent.state.userList;
    const currentUser = this.props.mainComponent.state.currentUser;
    const itemList = this.state.itemList;
    return this.state.dataLoaded ? (
      <Table striped bordered hover responsive width="200" variant="dark">
        <thead>
          <tr>
            <th>#</th>
            <th>Item Name</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {itemList.map((item) => {
            {
              console.log("Here");
              console.log(typeof item);
            }
            return (
              <tr>
                <td>{item.item_id}</td>
                <td>
                  <Link
                    className="cartItemName"
                    to="/Item_Listing"
                    onClick={(e) => this.handleCheckItem(e, item)}>
                    {item.item_name}
                  </Link>
                </td>
                <td>
                  {" "}
                  <span className="cartItemName">{item.price}</span>
                </td>
                <td>
                  {item.available === true &&
                  !item.deleted &&
                  !item.ownerBanned ? (
                    <Button
                      className="comment-btn"
                      onClick={(e) => {
                        this.handleBuy(e, item);
                      }}>
                      Buy
                    </Button>
                  ) : currentUser.purchased.includes(item._id) ? (
                    <Button className="comment-btn" disabled>
                      Bought by you
                    </Button>
                  ) : (
                    <Button className="comment-btn" disabled>
                      Not Available
                    </Button>
                  )}
                  <Button
                    className="comment-btn"
                    onClick={(e) => {
                      this.handleDelete(e, item);
                    }}>
                    Delete
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    ) : (
      <></>
    );
  }
}

class CartContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userLoggedIn: null,
      mainComponent: this.props.mainComponent,
      // userList: this.props.userList,
      // itemList: this.props.itemList,
      currentUser: this.props.currentUser,
    };
  }

  async componentDidMount() {
    await checkSession(this, this.props.mainComponent);
    console.log("========================================");
  }

  render() {
    console.log("in cart container");
    console.log(this.props.mainComponent.state.currentUser);
    console.log("User logged in: " + this.state.userLoggedIn);
    return this.state.userLoggedIn === true ? (
      <div id="cart-container">
        <CartItems
          mainComponent={this.props.mainComponent}
          currentUser={this.state.currentUser}
          itemList={this.state.itemList}
        />
        <div className="fixed-bottom">
          <footer className="footer">
            <div id="slogan">
              <span>This is a website for camera lovers</span>
            </div>
          </footer>
        </div>
      </div>
    ) : this.state.userLoggedIn === null ? (
      <></>
    ) : (
      <Redirect to="/Login" />
    );
  }
}

export default CartContainer;
