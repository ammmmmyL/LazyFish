// environment configutations
import { json } from "body-parser";
import ENV from "./../config.js";
const API_HOST = ENV.api_host;

// A function to send a GET request to the web server to get an item by its id
export const getItems = async (profile, currentUser) => {
  console.log("in getItems fetch call");

  let item_to_display_temp = [];
  let item_sold_temp = [];
  for (let i = 0; i < currentUser.item_list.length; i++) {
    // the URL for the request
    const url = `${API_HOST}/api/items/${currentUser.item_list[i]}`;

    // Since this is a GET request, simply call fetch on the URL
    await fetch(url)
      .then((res) => {
        if (res.status === 200) {
          // return a promise that resolves with the JSON body
          return res.json();
        } else {
          console.log("Could not get item");
        }
      })
      .then((json) => {
        // the resolved promise with the JSON body
        //console.log(json)
        if (json.deleted === false) {
          if (json.available === true) {
            item_to_display_temp.push(json);
          } else {
            item_sold_temp.push(json);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  //console.log(item_to_display_temp[0])
  profile.setState({
    item_to_display: item_to_display_temp,
    item_sold: item_sold_temp,
  });
  //console.log(profile)
};

// A function to send a POST request with a new item
export const addItem = async (addListing, newItem, currentUser) => {
    console.log("in addItem fetch call");
    // the URL for the request
    console.log(newItem);
    console.log(currentUser);
    const url = `${API_HOST}/api/${currentUser._id}/items`;

    // Create our request constructor with all the parameters we need
    const request = new Request(url, {
        method: "post",
        body: JSON.stringify(newItem),
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
        },
    });

    // Send the request with fetch()
    await fetch(request)
        .then(function (res) {
            // Handle response we get from the API.
            // Usually check the error codes to see what happened.
            if (res.status === 200) {
                return res.json();
            }
        })
        .then((json) => {
            // add to current user's item list
            addListing.state.main.setState({
                currentUser: json.user,
            });
            addListing.setState({
                itemAdded: true,
                itemStatus: "Item Added Successfully!"
            })
            //console.log(addListing)
            //console.log("Item added!");
            return;
        })
        .catch((error) => {
            console.log(error);
        });
};

// A function to get comments under currentItem
export const getCommentsUnderCurrentItem = async (
  commentsContainerComponent,
  currentItemMongoId
) => {
  const url = `${API_HOST}/api/items/` + currentItemMongoId + `/comments`;
  await fetch(url)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        alert("Could not get comments.");
      }
    })
    .then((json) => {
      if (json.currentItemComments) {
        commentsContainerComponent.setState({
          commentsLoaded: true,
          currentItemComments: json.currentItemComments,
        });
      } else {
        alert("Comments get but error.");
      }
    })
    .catch((error) => console.log(error));
};

export const addCommentsUnderCurrentItem = async (
  mainComponent,
  currentItemMongoId,
  newComment
) => {
  const url = `${API_HOST}/api/items/` + currentItemMongoId + `/comments`;
  const request = new Request(url, {
    method: "post",
    body: JSON.stringify(newComment),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
  });

  await fetch(request)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        alert("Could not add comments.");
      }
    })
    .then((json) => {
      if (json.savedCurrentItemDocument) {
        mainComponent.setState({
          currentItem: json.savedCurrentItemDocument,
        });
      } else {
        alert("Comments added but error.");
      }
    })
    .catch((error) => console.log(error));
};

export const getAllItems = async (itemList) => {
  console.log("in getAllItems fetch call");
  const url = `${API_HOST}/api/items`;
  await fetch(url)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        alert("Could not get items");
      }
    })
    .then(function (temp) {
      itemList.setState({
        arr: temp,
      });
    });
};

export const getAllItemsNum = async (itemList) => {
    console.log("in getAllItemsNum fetch call");
    const url = `${API_HOST}/api/addItem/items`;
    await fetch(url)
        .then((res) => {
            if (res.status === 200) {
                return res.json();
            } else {
                alert("Could not get items");
            }
        })
        .then(function (num) {
            //console.log(num.itemNum)
            itemList.setState({
                itemList: num.itemNum,
            });
        });
};

export const reportComment = async (reportedCommentMongoId, newReport) => {
  const url = `${API_HOST}/api/items/comments/` + reportedCommentMongoId;
  console.log("Report URL:" + url);
  const request = new Request(url, {
    method: "post",
    body: JSON.stringify(newReport),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
  });
  // Send the request with fetch()
  await fetch(request)
    .then(function (res) {
      // Handle response we get from the API.
      // Usually check the error codes to see what happened.
      if (res.status === 200) {
        return res.json();
      }
    })
    .then((json) => {
      // add to current user's item list
      if (!json.report_success) {
        alert("report fail!");
      } else {
        return;
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

export const addToCart = async (
  currentItemMongoId,
  currentUserMongoId,
  itemDetailsComponent,
  mainComponent
) => {
  const url =
    `${API_HOST}/api/users/cart/` +
    currentItemMongoId +
    "/" +
    currentUserMongoId;
  const request = new Request(url, {
    method: "post",
    body: JSON.stringify({}),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
  });

  await fetch(request)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      }
    })
    .then((json) => {
      if (!json.addToCartSuccess) {
        alert("failed to add to cart!");
      } else {
        mainComponent.setState({
          currentUser: json.savedUserDocument,
        });
        itemDetailsComponent.setState({
          alreadyInCart: true,
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getCartItems = async (userMongoId, cartComponent) => {
  const url = `${API_HOST}/api/users/cart/` + userMongoId;
  await fetch(url)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      }
    })
    .then((json) => {
      if (!json.cartItemList) {
        alert("cannot get cart items!");
      } else {
        cartComponent.setState({
          itemList: json.cartItemList,
          dataLoaded: true,
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
