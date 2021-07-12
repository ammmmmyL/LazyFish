import React from "react";
import "./css/index.css";
import CartContainer from "./components/ShoppingCart";

class ShoppingCart extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     userList: this.props.user,
  //     itemList: this.props.items,
  //     mainComponent: this.props.mainComponent,
  //   };
  // }
  render() {
    console.log("Shopping_Cart.js");
    console.log(this.props.mainComponent);
    return (
      <React.Fragment>
        <CartContainer
          mainComponent={this.props.mainComponent}
          userList={this.props.user}
          itemList={this.props.items}
          currentUser={this.props.mainComponent.state.currentUser}
        />
      </React.Fragment>
    );
  }
}

export default ShoppingCart;
