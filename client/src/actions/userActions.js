// environment configutations
import ENV from "./../config.js";
const API_HOST = ENV.api_host;

// A function to send a POST request with the user to be logged in
// Set state of mainComponent and loginComponent
export const login = async (
  username,
  password,
  loginComponent,
  mainComponent
) => {
  console.log("Main Component in login function: ");
  console.log(mainComponent);
  // Create our request constructor with all the parameters we need
  const request = new Request(`${API_HOST}/api/users/login`, {
    method: "post",
    body: JSON.stringify({ username: username, password: password }),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
  });

  // Send the request with fetch()
  await fetch(request)
    .then((res) => {
      console.log("Login response: ");
      console.log(res);
      return res.json();
    })
    .then((json) => {
      if (json.currentUser !== undefined) {
        // console.log(json);
        mainComponent.setState({
          currentUser: json.currentUser,
          userType: json.currentUser.user_type,
        });
        loginComponent.setState({
          loginStatus: json.loginStatus,
        });
      } else {
        loginComponent.setState({
          loginStatus: json.loginStatus,
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

// Set state of registrationComponent
export const register = async (username, password, registrationComponent) => {
  // Create our request constructor with all the parameters we need
  const request = new Request(`${API_HOST}/api/users/registration`, {
    method: "post",
    body: JSON.stringify({ username: username, password: password }),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
  });
  // Send the request with fetch()
  await fetch(request)
    .then((res) => {
      console.log("Login response: ");
      console.log(res);
      return res.json();
    })
    .then((json) => {
      if (json.newUser !== undefined) {
        // console.log(json);
        registrationComponent.setState({
          registerStatus: json.registerStatus,
        });
      } else {
        registrationComponent.setState({
          registerStatus: json.registerStatus,
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getOwnerOfCurrentItem = async (
  itemDetailsMainComponent,
  ownerUserId
) => {
  const url = `${API_HOST}/api/users/` + ownerUserId;
  try {
    await fetch(url)
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          // alert("Owner not found.");
        }
      })
      .then((json) => {
        if (!json.owner) {
          alert("Owner empty.");
        } else {
          itemDetailsMainComponent.setState({
            ownerOfCurrentItem: json.owner,
            dataLoaded: true,
          });
          console.log(itemDetailsMainComponent.state);
        }
      })
      .catch((error) => {
        console.log("UNAUTHORIZED!");
        itemDetailsMainComponent.props.mainComponent.setState({
          currentUser: null,
        });
        itemDetailsMainComponent.setState({
          dataLoaded: false,
          userLoggedIn: false,
        });
        console.log(error);
      });
  } catch (error) {
    console.log(error);
  }
};

export const buyItemInCart = async (userMongoId, itemMongoId) => {
  const url =
    `${API_HOST}/api/users/cart/buy/` + userMongoId + `/` + itemMongoId;
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
      if (res.state === 200) {
        return res.json();
      }
    })
    .then((json) => {
      if (!json.purchaseSuccess) {
        alert("Purchase fail!");
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

export const deleteItemInCart = async (
  userMongoId,
  itemMongoId,
  mainComponent
) => {
  const url =
    `${API_HOST}/api/users/cart/delete/` + userMongoId + `/` + itemMongoId;
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
      console.log(res);
      if (res.status === 200) {
        return res.json();
      }
    })
    .then((json) => {
      if (!json.deleteSuccess) {
        alert("Delete fail!");
      } else {
        mainComponent.setState({
          currentUser: json.savedUserDocument,
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

// A function to send a GET request to destroy sessions
export const userLogOut = async (mainComponent) => {
  console.log("Main Component in login function: ");
  console.log(mainComponent);
  const url = `${API_HOST}/users/logout`;

  // Since this is a GET request, simply call fetch on the URL
  await fetch(url)
    .then((res) => {
      mainComponent.setState({
        currentUser: null,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

// A function to check current session
export const checkSession = async (currentComponent, mainComponent) => {
  const url = `${API_HOST}/api/users/check-session`;
  await fetch(url)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        throw "Unauthorized session";
      }
    })
    .then((json) => {
      console.log("JSON: ");
      console.log(json.currentUser);

      mainComponent.setState({
        currentUser: json.currentUser,
      });
      currentComponent.setState({
        userLoggedIn: true,
      });
    })
    .catch((error) => {
      console.log(error);

      mainComponent.setState({
        currentUser: null,
      });
      currentComponent.setState({
        userLoggedIn: false,
      });
    });
};
