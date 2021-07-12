import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import Carousel from "react-bootstrap/Carousel";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import img from "../img/logo.png";
import { userList, itemList, currentItem } from "./Data";
import { comment, report } from "./Objects";
import "../css/ItemDetail_style.css";
import { getOwnerOfCurrentItem, checkSession } from "../actions/userActions";
import {
  getCommentsUnderCurrentItem,
  addCommentsUnderCurrentItem,
  reportComment,
  addToCart,
} from "../actions/itemActions";

const currentTime = "2020.02.04 11:27 pm";

//#region item display section
// params: item pictures
class ItemDisplayCarousel extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    console.log("In Carousel");
    console.log(this.props);
    const pictures = this.props.itemImgs;
    return (
      <div id="item-img-col" className="col">
        <Carousel id="item-details-carousel">
          {pictures.map((item) => {
            return (
              <Carousel.Item className="carousel-content-img">
                <div className=" img-center-container">
                  <img
                    className="carousel-content-img d-block"
                    src={item}
                    alt="item detail picture"
                  />
                </div>
              </Carousel.Item>
            );
          })}
        </Carousel>
      </div>
    );
  }
}

// params: item
class ItemDetailsCol extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alreadyInCart: this.props.mainComponent.state.currentUser.cart.includes(
        this.props.mainComponent.state.currentItem._id
      ),
    };
  }

  handleAddToCart = async () => {
    await addToCart(
      this.props.mainComponent.state.currentItem._id,
      this.props.mainComponent.state.currentUser._id,
      this,
      this.props.mainComponent
    );
    return;
  };
  handleFavourite = () => {
    return;
  };

  render() {
    console.log("ItemDetails props:");
    console.log(this.props);
    const item = this.props.mainComponent.state.currentItem;
    const currentUser = this.props.mainComponent.state.currentUser;
    // const owner = this.props.mainComponent.state.userList[item.owner]
    const owner = this.props.ownerOfCurrentItem;
    return (
      <div className="transparentbox-des">
        <div id="item-details-col" className="col">
          <section id="product-title">
            <h1>{item.item_name}</h1>
          </section>
          <section id="product-price">
            <h2>${item.price}</h2>
          </section>
          <section>
            <p>
              Seller:{" "}
              {owner.user_name === currentUser.user_name
                ? "Yourself"
                : owner.user_name}
            </p>
          </section>
          <section id="seller-credit-point">
            <p>{owner.user_name}'s credit rating:</p>{" "}
            {owner.credit_point >= 5 ? (
              <p className="good-credit">Great!</p>
            ) : 4 <= owner.credit_point < 5 ? (
              <p className="good-credit">Good!</p>
            ) : 2 <= owner.credit_point < 4 ? (
              <p className="normal-credit">Normal!</p>
            ) : (
              <p className="bad-credit">Bad!</p>
            )}
          </section>
          <section id="item-description">
            <div id="description" className="">
              <div className="item-description">Description:</div>
              <p>{item.description}</p>
            </div>
          </section>
          <section id="details-btn-container">
            {currentUser.user_id === item.owner && item.available !== false ? (
              <>
                {this.state.alreadyInCart || item.available === false ? (
                  <Button type="button" className="btn btn-dark" disabled>
                    {item.available === false ? "Sold Out" : "Add to Cart"}
                  </Button>
                ) : (
                  <Button type="button" className="btn btn-dark" disabled>
                    Add to Cart
                  </Button>
                )}
              </>
            ) : (
              <>
                {this.state.alreadyInCart || item.available === false ? (
                  <Button type="button" className="btn btn-dark" disabled>
                    {item.available === false ? "Sold Out" : "Add to Cart"}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    className="btn btn-dark"
                    onClick={() => {
                      this.handleAddToCart();
                    }}>
                    Add to Cart
                  </Button>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    );
  }
}

// params: item
class ItemContainer extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const currentUser = this.props.mainComponent.state.currentUser;
    const item = this.props.mainComponent.state.currentItem;
    console.log("In Item Container");
    console.log(this.props.mainComponent.state.currentItem);
    return (
      <div id="item-container" className="row">
        <ItemDisplayCarousel itemImgs={item.pictures} />
        <ItemDetailsCol
          mainComponent={this.props.mainComponent}
          ownerOfCurrentItem={this.props.ownerOfCurrentItem}
        />
      </div>
    );
  }
}
//#endregion

//#region comments section

// params: userList, comments, currentUser
class CommentSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newComment: "",
      replyingCommentId: null,
      replyContent: "",
      currentItemComments: this.props.currentItemComments,
    };
  }

  // comment object used here:
  // {
  //   "comment_mongo_id": "7739617802a898e97c0", => mongoId
  //   "comment_id": 1,
  //   "visible": true,
  //   "author": "user5", => username
  //   "reply_to": null, => username
  //   "item_id": "60685a3c58fc0606481a9ad5", => mongoId
  //   "reply_time": "2021-04-04T11:04:01.968Z",
  //   "content": "Comment from User 5",
  //   "reported_by": => "user5" => username
  // }

  handleAddComment = async (e) => {
    e.preventDefault();
    if (this.state.newComment !== "") {
      const newComment = new comment(
        this.props.mainComponent.state.currentItem.comments.length + 1,
        true,
        this.props.mainComponent.state.currentUser._id,
        null,
        this.props.mainComponent.state.currentItem.item_id,
        new Date(),
        this.state.newComment,
        null
      );
      // add first
      await addCommentsUnderCurrentItem(
        this.props.mainComponent,
        this.props.mainComponent.state.currentItem._id,
        newComment
      );
      // get new version of comments
      await getCommentsUnderCurrentItem(
        this,
        this.props.mainComponent.state.currentItem._id
      );
      this.setState({
        newComment: "",
      });
    } else {
      console.log("Cannot add empty comment!");
    }
  };

  handleWriteComment = (e) => {
    this.setState({
      newComment: e.target.value,
    });
  };

  handleReplyToggler = (nothing, e, cmt) => {
    if (this.state.replyingCommentId !== cmt.comment_id) {
      this.setState({
        replyingCommentId: cmt.comment_id,
        replyContent: "",
      });
    } else {
      this.setState({
        replyingCommentId: null,
        replyContent: "",
      });
    }
  };

  handleReplyContentChange = (e) => {
    e.preventDefault();

    this.setState({
      replyContent: e.target.value,
    });
  };

  handleReplySubmit = async (e, cmt) => {
    e.preventDefault();
    const mainComponent = this.props.mainComponent;
    if (this.state.replyContent !== "") {
      const newReply = new comment(
        mainComponent.state.currentItem.comments.length + 1,
        true,
        mainComponent.state.currentUser._id,
        cmt.author,
        cmt.item_id,
        new Date(),
        this.state.replyContent,
        null
      );
      // add first
      await addCommentsUnderCurrentItem(
        this.props.mainComponent,
        this.props.mainComponent.state.currentItem._id,
        newReply
      );
      // get new version of comments
      await getCommentsUnderCurrentItem(
        this,
        this.props.mainComponent.state.currentItem._id
      );
      this.setState({
        newReply: "",
        replyingCommentId: null,
      });
    } else {
      console.log("Cannot add empty comment!");
    }
  };

  handleCommentReport = async (e, cmt) => {
    console.log(cmt);
    const currentUser = this.props.mainComponent.state.currentUser;
    const currentItem = this.props.mainComponent.state.currentItem;
    const newReport = new report(
      undefined,
      currentUser._id,
      cmt.author,
      currentItem._id,
      cmt.comment_mongo_id,
      "pending"
    );
    await reportComment(cmt.comment_mongo_id, newReport);
    await getCommentsUnderCurrentItem(
      this,
      this.props.mainComponent.state.currentItem._id
    );
    // allReportsTemp.push(newReport);
    // adminTemp.unhandled_reports.push(newReport);
    // adminListTemp[1] = adminTemp;
    // cmt.reported_by = currentUser.user_id;
    // this.props.mainComponent.setState({
    //   allReports: allReportsTemp,
    //   adminList: adminListTemp,
    // });
  };

  render() {
    const currentUser = this.props.mainComponent.state.currentUser;
    const comments = this.state.currentItemComments;
    const totalComments = comments.filter((cmt) => {
      return cmt.visible === true && cmt.author !== "Banned User";
    });
    console.log("In CommentSection");
    console.log(this.state);
    return (
      <>
        <div className="container" id="comment-section">
          <div className="transparentbox">
            <div className="row" id="addcomment">
              <form
                id="comment-input-form"
                onSubmit={(e) => {
                  this.handleAddComment(e);
                }}>
                <div className="textAdjust">
                  <textarea
                    className="form-control"
                    placeholder=" Write a comment..."
                    value={this.state.newComment}
                    onChange={this.handleWriteComment}></textarea>
                </div>
                <br />
                <input
                  type="submit"
                  className="btn btn-primary"
                  value="Add a comment"
                />
              </form>
              <div id="comment-title" className="row">
                Total Comments {totalComments.length}
              </div>
            </div>

            {comments.map((cmt) => {
              return (
                <>
                  {cmt.visible === false || cmt.author === "Banned User" ? (
                    <React.Fragment></React.Fragment>
                  ) : (
                    <>
                      <div className="row">
                        <small>
                          <strong className="user">
                            {cmt.author === currentUser.user_name
                              ? "You"
                              : cmt.author}{" "}
                            {cmt.reply_to === null
                              ? null
                              : "replied to " + cmt.reply_to}
                          </strong>{" "}
                          {cmt.reply_time}
                        </small>
                      </div>

                      <p className="row comment head">{cmt.content}</p>
                      {cmt.author !== currentUser.user_name ? (
                        <React.Fragment>
                          <Form
                            onSubmit={(e) => this.handleReplySubmit(e, cmt)}>
                            {this.state.replyingCommentId === cmt.comment_id ? (
                              <>
                                <Form.Group>
                                  <Form.Control
                                    type="text"
                                    placeholder="Reply"
                                    value={this.state.replyContent}
                                    onChange={(e) => {
                                      this.handleReplyContentChange(e);
                                    }}
                                  />
                                </Form.Group>
                                <div className="reply-btn">
                                  <Button
                                    className="comment-btn"
                                    variant="primary"
                                    type="submit">
                                    Submit
                                  </Button>
                                </div>
                              </>
                            ) : null}
                            <div className="reply-btn">
                              <Button
                                className="comment-btn"
                                variant="primary"
                                onClick={(e) =>
                                  this.handleReplyToggler(this, e, cmt)
                                }>
                                {this.state.replyingCommentId === cmt.comment_id
                                  ? "Cancel"
                                  : "Reply"}
                              </Button>
                            </div>
                            <>
                              {cmt.reported_by === null ? (
                                <Button
                                  variant="danger"
                                  onClick={(e) =>
                                    this.handleCommentReport(e, cmt)
                                  }>
                                  Report
                                </Button>
                              ) : (
                                <Button
                                  className="report-btn "
                                  variant="danger"
                                  disabled>
                                  {cmt.reported_by === currentUser.user_name
                                    ? "Reported by you"
                                    : "Reported by others"}
                                </Button>
                              )}
                            </>
                          </Form>
                        </React.Fragment>
                      ) : null}
                    </>
                  )}
                  <hr />
                </>
              );
            })}
          </div>
        </div>
      </>
    );
  }
}

// params: userList, comments
class CommentsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      commentsLoaded: false,
    };
  }

  componentDidMount() {
    getCommentsUnderCurrentItem(
      this,
      this.props.mainComponent.state.currentItem._id
    );
  }

  render() {
    return this.state.commentsLoaded ? (
      <>
        <div className="comments-container">
          <CommentSection
            mainComponent={this.props.mainComponent}
            ownerOfCurrentItem={this.state.ownerOfCurrentItem}
            currentItemComments={this.state.currentItemComments}
          />
        </div>
      </>
    ) : (
      <></>
    );
  }
}
//#endregion

class MainContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userLoggedIn: null,
      dataLoaded: false,
    };
  }

  async componentDidMount() {
    await checkSession(this, this.props.mainComponent);
    if (this.props.mainComponent.state.currentItem) {
      await getOwnerOfCurrentItem(
        this,
        this.props.mainComponent.state.currentItem.owner
      );
    } else {
      return;
    }
  }

  componentWillUnmount() {
    this.setState({
      dataLoaded: false,
      ownerOfCurrentItem: undefined,
    });
  }

  render() {
    console.log("USER LOGGED IN?" + this.state.userLoggedIn);
    return this.state.userLoggedIn === true ? (
      this.state.dataLoaded ? (
        <div id="main-container" className="container">
          {console.log("MainContainer state:")}
          {console.log(this.state)}
          <ItemContainer
            currentUser={this.props.mainComponent.state.currentUser}
            itemDetails={this.props.mainComponent.state.currentItem}
            mainComponent={this.props.mainComponent}
            ownerOfCurrentItem={this.state.ownerOfCurrentItem}
          />
          <hr />
          <CommentsContainer
            mainComponent={this.props.mainComponent}
            ownerOfCurrentItem={this.state.ownerOfCurrentItem}
          />
          <div className="fixed-bottom">
            <footer className="footer">
              <div id="slogan">
                <span>This is a website for camera lovers</span>
              </div>
            </footer>
          </div>
        </div>
      ) : (
        <h1>Data loading...</h1>
      )
    ) : this.state.userLoggedIn === false ? (
      <Redirect to="/Login" />
    ) : (
      <></>
    );
  }
}

export default MainContainer;
