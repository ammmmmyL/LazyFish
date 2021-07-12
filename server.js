/* server.js for react-express-authentication */
"use strict";

/* Server environment setup */
// To run in development mode, run normally: node server.js
// To run in development with the test user logged in the backend, run: TEST_USER_ON=true node server.js
// To run in production mode, run in terminal: NODE_ENV=production node server.js
const env = process.env.NODE_ENV; // read the environment variable (will be 'production' in production mode)

const USE_TEST_USER = env !== "production" && process.env.TEST_USER_ON; // option to turn on the test user.
const TEST_USER_ID = "user1"; // the id of our test user (you will have to replace it with a test user that you made). can also put this into a separate configutation file
const TEST_USER_EMAIL = "test@user.com";
//////

const log = console.log;
const path = require("path");

const express = require("express");
// starting the express server
const app = express();

// enable CORS if in development, for React local development server to connect to the web server.
const cors = require("cors");
if (env !== "production") {
  app.use(cors());
}

// mongoose and mongo connection
const { mongoose } = require("./db/mongoose");
mongoose.set("useFindAndModify", false); // for some deprecation issues

// import the mongoose models
const { User, Item, Admin, Report, Comment } = require("./models/Schemas");

// to validate object IDs
const { ObjectID } = require("mongodb");

// body-parser: middleware for parsing parts of the request into a usable object (onto req.body)
const bodyParser = require("body-parser");
app.use(bodyParser.json()); // parsing JSON body
app.use(bodyParser.urlencoded({ extended: true })); // parsing URL-encoded form data (from form POST requests)

// express-session for managing user sessions
const session = require("express-session");
const MongoStore = require("connect-mongo"); // to store session information on the database in production

function isMongoError(error) {
  // checks for first error returned by promise rejection if Mongo database suddently disconnects
  return (
    typeof error === "object" &&
    error !== null &&
    error.name === "MongoNetworkError"
  );
}

// middleware for mongo connection error for routes that need it
const mongoChecker = (req, res, next) => {
  // check mongoose connection established.
  if (mongoose.connection.readyState != 1) {
    log("Issue with mongoose connection");
    res.status(500).send("Internal server error");
    return;
  } else {
    next();
  }
};

// Middleware for authentication of resources
const authenticate = (req, res, next) => {
  if (env !== "production" && USE_TEST_USER)
    req.session.username = TEST_USER_ID; // test user on development. (remember to run `TEST_USER_ON=true node server.js` if you want to use this user.)

  if (req.session.user) {
    req.session.touch();
    User.findOne({ user_name: req.session.username })
      .then((user) => {
        if (!user) {
          return Promise.reject();
        } else {
          req.user = user;
          next();
        }
      })
      .catch((error) => {
        res
          .status(401)
          .sendFile(path.join(__dirname, "/client/build/index.html"));
        // res.status(401).send("Unauthorized");
      });
  } else {
    // res.status(401).send("Unauthorized");
    res.status(401).sendFile(path.join(__dirname, "/client/build/index.html"));
  }
};

const authenticateAdmin = (req, res, next) => {
  console.log("Current Session User: " + req.session.user);
  console.log("Type: " + typeof req.session.user);
  if (req.session.user === 0) {
    if (req.session.user === 0) {
      next();
    } else {
      res.status(401).send("Unauthorized. You are NOT an Admin");
    }
  } else {
    console.log("AAAAAAAAAAAAAAAAAAAAAAA");
    res.status(401).send("Unauthorized");
  }
};

/*** Session handling **************************************/
// Create a session and session cookie
app.use(
  session({
    secret: process.env.SESSION_SECRET || "our hardcoded secret", // make a SESSION_SECRET environment variable when deploying (for example, on heroku)
    resave: true,
    rolling: true,
    saveUninitialized: false,
    cookie: {
      expires: 600000,
      httpOnly: true,
    },
    // store the sessions on the database in production
    store:
      env === "production"
        ? MongoStore.create({
            mongoUrl:
              process.env.MONGODB_URI || "mongodb://localhost:27017/LazyFish",
          })
        : null,
  })
);

// A route to logout a user
app.get("/users/logout", (req, res) => {
  // Remove the session
  req.session.destroy((error) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.send();
    }
  });
});

// A route to check if a user is logged in on the session
app.get("/api/users/check-session", async (req, res) => {
  try {
    if (req.session.user) {
      console.log(req.session.user);
      const userDocument = await User.findOne({
        user_id: req.session.user,
      });
      if (userDocument) {
        res.send({ currentUser: userDocument });
      } else {
        res.status(404).send();
      }
    } else {
      res.status(401).send();
    }
  } catch (error) {
    console.log(error);
    res.status(404).send();
  }
});

///*********************************************************/

///*** API Routes below ************************************/
// User API Route
app.post("/api/createAdmin", mongoChecker, async (req, res) => {
  log(req.body);

  // Create a new user
  const user = new User({
    user_id: 0,
    user_name: "admin",
    password: "admin",
    user_type: "admin",
  });

  try {
    // Save the user
    const newUser = await user.save();
    res.send(newUser);
  } catch (error) {
    if (isMongoError(error)) {
      // check for if mongo server suddenly disconnected before this request.
      res.status(500).send("Internal server error");
    } else {
      log(error);
      res.status(400).send("Bad Request"); // bad request for changing the student.
    }
  }
});

// A route to login and create a session
app.post("/api/users/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // log(email, password);
  // Use the static method on the User model to find a user
  // by their email and password
  try {
    //User.findByUsernamePassword returns a promise!!!!!!
    const userPromise = User.findByUsernamePassword(username, password);
    userPromise
      .then((user) => {
        // Add the user's id to the session.
        // We can check later if this exists to ensure we are logged in.
        req.session.user = user.user_id;
        req.session.username = user.user_name; // we will later send the email to the browser when checking if someone is logged in through GET /check-session (we will display it on the frontend dashboard. You could however also just send a boolean flag).
        res.send({ currentUser: user, loginStatus: "success" });
        console.log("Session created with user: ");
        console.log(req.session.user);
      })
      .catch((error) => {
        console.log(error);
        res.status(400).send({ loginStatus: error.loginStatus });
      });
  } catch (error) {
    if (isMongoError(error)) {
      // check for if mongo server suddenly disconnected before this request.
      res.status(500).send("Internal server error");
    } else {
      log(error);
      res.status(400).send("Bad Request"); // bad request for changing the student.
    }
  }
});

// A route to get Owner information of currentItem in itemListing page
app.get("/api/users/:user_id", mongoChecker, authenticate, async (req, res) => {
  console.log(req.params);
  const ownerDocument = await User.findOne({
    user_id: parseInt(req.params.user_id),
  });
  try {
    if (!ownerDocument) {
      res.status(404).send("Owner not found.");
    } else {
      res.send({
        owner: ownerDocument,
      });
    }
  } catch (error) {
    if (isMongoError(error)) {
      // check for if mongo server suddenly disconnected before this request.
      res.status(500).send("Internal server error");
    } else {
      log(error);
      res.status(400).send("Bad Request"); // bad request for changing the student.
    }
  }
});

// A route to create new user
// Accept request body like
// {
//   "username": "user1",
//   "password": "user1"
// }
app.post("/api/users/registration", mongoChecker, async (req, res) => {
  const newUsername = req.body.username;
  const newPassword = req.body.password;
  console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
  console.log(req.body);
  try {
    const duplicateUser = await User.findOne({
      user_name: newUsername,
    });
    if (duplicateUser) {
      console.log("Duplicated User Name.");
      res.status(400).send({
        message: "User exists.",
        registerStatus: "user exists",
      });
    } else {
      const allUsersList = await User.find();
      const totalUserNumber = allUsersList.length;
      const newUser = new User({
        user_id: totalUserNumber,
        user_name: newUsername,
        password: newPassword,
        user_type: "regular",
        banned: false,
        credit_point: 5,
        item_list: [],
        profilePic: [], // Figure out how to store images
        cart: [],
        purchased: [],
      });
      console.log("New User: ");
      console.log(newUser);
      try {
        const savedNewUser = await newUser.save();
        console.log("New User Created.");
        res.send({
          newUser: savedNewUser,
          registerStatus: "success",
        });
      } catch (error) {
        if (isMongoError(error)) {
          // check for if mongo server suddenly disconnected before this request.
          res.status(500).send({
            message: "Internal Server Error",
            registerStatus: "unknown error",
          });
        } else {
          log(error);
          res.status(400).send({
            message: "Bad Request",
            registerStatus: "unknown error",
          }); // bad request for changing the student.
        }
      }
    }
  } catch (error) {
    if (isMongoError(error)) {
      // check for if mongo server suddenly disconnected before this request.
      res.status(500).send("Internal server error");
    } else {
      log(error);
      res.status(400).send("Bad Request"); // bad request for changing the student.
    }
  }
});

///***** Item routes *****/
// Item API Route
// a GET route to get the number of items in database
app.get("/api/addItem/items", mongoChecker, authenticate, async (req, res) => {
  // Get the users
  try {
    const items = await Item.find();
    if (!items) {
      res.status(404).send("Resource not found");
    } else {
      const itemNum = items.length;
      res.send({ itemNum });
    }
  } catch (error) {
    log(error);
    res.status(500).send("Internal Server Error");
  }
});

// a GET route to get all legal and available itmes
app.get("/api/items", mongoChecker, async (req, res) => {
  let temp = [];
  let users = [];
  User.find()
    .then((userGet) => {
      // log("USERS:", userGet)
      users = userGet;
    })
    .catch((error) => {
      log(error);
      res.status(500).send("Internal Server Error1");
    });

  Item.find()
    .then((items) => {
      // log("items:", items)
      for (let i = 0; i < items.length; i++) {
        for (let j = 0; j < users.length; j++) {
          if (items[i].owner === users[j].user_id) {
            if (users[j].banned === false) {
              //log("not banned user:", users[j])
              if (items[i].available === true) {
                if (items[i].deleted === false) {
                  temp.push(items[i]);
                  // log("temp here:", temp)
                }
              }
            }
          }
        }
      }
      res.send(temp);
    })
    .catch((error) => {
      log(error);
      res.status(500).send("Internal Server Error2");
    });
});

// Get Item by item_id
// a GET route to get a item by their id.
app.get("/api/items/:id", mongoChecker, authenticate, async (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    res.status(404).send(); // if invalid id, definitely can't find resource, 404.
    return; // so that we don't run the rest of the handler.
  }

  // If id valid, findById
  try {
    const itemFound = await Item.findById(id);
    if (!itemFound) {
      res.status(404).send("Resource not found"); // could not find this student
    } else {
      res.send(itemFound);
    }
  } catch (error) {
    if (isMongoError(error)) {
      // check for if mongo server suddenly disconnected before this request.
      res.status(500).send("Internal server error");
    } else {
      log(error);
      res.status(400).send("Bad Request"); // bad request for changing the student.
    }
  }
});

// Add Item to specific user
app.post(
  "/api/:user_id/items",
  mongoChecker,
  authenticate,
  async (req, res) => {
    //log(req.body)

    const user_id = req.params.user_id;

    // validate user_id
    if (!ObjectID.isValid(user_id)) {
      res.status(404).send(); // if invalid id, definitely can't find resource, 404.
      return; // so that we don't run the rest of the handler.
    }

    // Create a new item
    const item = new Item({
      item_id: req.body.item_id,
      item_name: req.body.item_name,
      owner: req.body.owner,
      pictures: req.body.pictures,
      description: req.body.description,
      price: req.body.price,
      available: req.body.available,
      comments: req.body.comments,
      deleted: req.body.deleted,
    });

    try {
      // Save the item
      const newItem = await item.save();
      // find current user
      const currentUser = await User.findById(user_id);
      if (!currentUser) {
        res.status(404).send("User not found"); // could not find this student
      } else {
        // add to current user's item list
        currentUser.item_list.push(newItem._id);
        const userSaved = await currentUser.save();
        if (!userSaved) {
          res.status(404).send("Can't Save Item"); // could not save item to user
        } else {
          res.send({
            item: newItem,
            user: userSaved,
          });
        }
      }
    } catch (error) {
      if (isMongoError(error)) {
        // check for if mongo server suddenly disconnected before this request.
        res.status(500).send("Internal server error");
      } else {
        log(error);
        res.status(400).send("Bad Request"); // bad request for changing the student.
      }
    }
  }
);

// A route to get all comments under an item
app.get(
  "/api/items/:item_mongoId/comments",
  mongoChecker,
  authenticate,
  async (req, res) => {
    try {
      const currentItemDocument = await Item.findById(req.params.item_mongoId);
      const commentMongoIdList = currentItemDocument.comments;
      const comments = [];

      for (let i = 0; i < commentMongoIdList.length; i++) {
        const commentMongoId = commentMongoIdList[i];
        const commentDocument = await Comment.findById(commentMongoId);
        const authorDocument = await User.findById(commentDocument.author);
        const replyToUserDocument = await User.findById(
          commentDocument.reply_to
        );
        const reportedByUserDocument = await User.findById(
          commentDocument.reported_by
        );
        // Create comment object and push into comments array
        const comment = {
          comment_mongo_id: commentDocument._id,
          comment_id: commentDocument.comment_id,
          visible: commentDocument.visible,
          author: authorDocument.banned
            ? "Banned User"
            : authorDocument.user_name, // user id
          reply_to:
            replyToUserDocument === null
              ? null
              : replyToUserDocument.banned
              ? "Banned User"
              : replyToUserDocument.user_name, // user id
          item_id: currentItemDocument._id, // item id
          reply_time: commentDocument.reply_time,
          content: commentDocument.content,
          reported_by:
            reportedByUserDocument === null
              ? null
              : reportedByUserDocument.user_name,
        };
        comments.unshift(comment);
      }

      res.send({
        currentItemComments: comments,
      });
    } catch (error) {
      if (isMongoError(error)) {
        // check for if mongo server suddenly disconnected before this request.
        res.status(500).send("Internal server error");
      } else {
        log(error);
        res.status(400).send("Bad Request"); // bad request for changing the student.
      }
    }
  }
);

// A route to get all items in the cart
app.get(
  "/api/users/cart/:user_mongoId",
  mongoChecker,
  authenticate,
  async (req, res) => {
    try {
      const userMongoId = req.params.user_mongoId;
      const userDocument = await User.findById(userMongoId);
      const cart = userDocument.cart;
      const cartItems = [];
      for (let i = 0; i < cart.length; i++) {
        const itemMongoId = cart[i];
        const itemDocument = await Item.findById(itemMongoId);
        // Check whether the owner is banned
        const ownerUserId = itemDocument.owner;
        const ownerDocument = await User.findOne({
          user_id: ownerUserId,
        });
        console.log(ownerDocument);
        if (!ownerDocument.banned) {
          cartItems.push(itemDocument);
        } else {
          const itemObject = {
            _id: itemDocument._id,
            pictures: itemDocument.pictures,
            comments: itemDocument.comments,
            item_id: itemDocument.item_id,
            item_name: itemDocument.item_name,
            owner: itemDocument.owner,
            description: itemDocument.description,
            price: itemDocument.price,
            available: itemDocument.available,
            deleted: itemDocument.deleted,
            ownerBanned: true,
          };
          cartItems.push(itemObject);
          console.log(itemDocument);
        }
      }
      res.send({
        cartItemList: cartItems,
      });
    } catch (error) {
      log(error);
      if (isMongoError(error)) {
        // check for if mongo server suddenly dissconnected before this request.
        res.status(500).send("Internal server error");
      } else {
        res.status(400).send("Bad Request"); // bad request for changing the item.
      }
    }
  }
);

// A route to buy item in the cart
app.post(
  "/api/users/cart/buy/:user_mongoId/:item_mongoId",
  mongoChecker,
  authenticate,
  async (req, res) => {
    const userMongoId = req.params.user_mongoId;
    const itemMongoId = req.params.item_mongoId;
    try {
      // Update user purchase list
      const userDocument = await User.findById(userMongoId);
      userDocument.purchased.push(itemMongoId);
      userDocument.credit_point += 1;

      // Update item availability
      const itemDocument = await Item.findById(itemMongoId);
      itemDocument.available = false;

      // Save data
      const savedUserDocument = await userDocument.save();
      const savedItemDocument = await itemDocument.save();
      if (savedUserDocument && savedItemDocument) {
        res.send({
          purchaseSuccess: true,
        });
      } else {
        throw "purchase failed";
      }
    } catch (error) {
      log(error);
      if (isMongoError(error)) {
        // check for if mongo server suddenly dissconnected before this request.
        res.status(500).send("Internal server error");
      } else {
        res.status(400).send("Bad Request"); // bad request for changing the item.
      }
    }
  }
);

// A route to delete item in the cart
app.post(
  "/api/users/cart/delete/:user_mongoId/:item_mongoId",
  mongoChecker,
  authenticate,
  async (req, res) => {
    console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
    const userMongoId = req.params.user_mongoId;
    const itemMongoId = req.params.item_mongoId;
    try {
      const userDocument = await User.findById(userMongoId);
      const newCart = userDocument.cart.filter((item) => {
        return item.toString() !== itemMongoId;
      });
      console.log("New Cart:");
      console.log(newCart);
      userDocument.cart = newCart;
      const savedUserDocument = await userDocument.save();
      res.send({
        deleteSuccess: true,
        savedUserDocument: savedUserDocument,
      });
    } catch (error) {
      log(error);
      if (isMongoError(error)) {
        // check for if mongo server suddenly dissconnected before this request.
        res.status(500).send("Internal server error");
      } else {
        res.status(400).send("Bad Request"); // bad request for changing the item.
      }
    }
  }
);

// A route to add item to current user's cart
app.post(
  "/api/users/cart/:item_mongoId/:user_mongoId",
  mongoChecker,
  authenticate,
  async (req, res) => {
    try {
      const item_mongoId = req.params.item_mongoId;
      const user_mongoId = req.params.user_mongoId;
      const userDocument = await User.findById(user_mongoId);
      userDocument.cart.push(item_mongoId);
      const savedUserDocument = await userDocument.save();
      res.send({
        addToCartSuccess: true,
        savedUserDocument: savedUserDocument,
      });
    } catch (error) {
      log(error);
      if (isMongoError(error)) {
        // check for if mongo server suddenly dissconnected before this request.
        res.status(500).send("Internal server error");
      } else {
        res.status(400).send("Bad Request"); // bad request for changing the item.
      }
    }
  }
);

// A route to report a comment
// req.body be like this:
// {
//   "report_id": undefined, // int
//     "reporter": mongoId,
//     "reportee": user_id, // user_id
//     "reported_item": mongoId, // item object
//     "reported_comment": mongoId, // comment oject
//     "decision": undefined; // string: active. resolved
// }
app.post(
  "/api/items/comments/:comment_mongoId",
  mongoChecker,
  authenticate,
  async (req, res) => {
    console.log("Body");
    console.log(req.body);
    try {
      const allReportDocuments = await Report.find();
      const report_id = allReportDocuments.length + 1;
      const reporteeDocument = await User.findOne({
        user_name: req.body.reportee,
      });
      const reporteeMongoId = reporteeDocument._id;
      // Save new report
      const newReport = new Report({
        report_id: report_id,
        reporter: req.body.reporter,
        reportee: reporteeMongoId,
        reported_item: req.body.reported_item,
        reported_comment: req.params.comment_mongoId,
        decision: "pending",
      });
      const savedNewReport = await newReport.save();

      // Update corresponding comment
      const reportedCommentDocument = await Comment.findById(
        req.params.comment_mongoId
      );
      reportedCommentDocument.reported_by = req.body.reporter;
      const savedReportedCommentDocument = await reportedCommentDocument.save();
      console.log("Updated Comment:");
      console.log(savedReportedCommentDocument);
      // // Update admin
      // const adminDocument = await Admin.findOne({
      //   user_type: "admin",
      // });
      // adminDocument.unhandled_reports.push(savedNewReport._id);
      // await adminDocument.save();
      res.send({
        report_success: true,
      });
    } catch (error) {
      if (isMongoError(error)) {
        // check for if mongo server suddenly disconnected before this request.
        res.status(500).send("Internal server error");
      } else {
        log(error);
        res.status(400).send("Bad Request"); // bad request for changing the student.
      }
    }
  }
);

// A route to add a comment under an item
// req.body be like this:
// {
//   "visible": true,
//   "author": user_mongoid,
//   "reply_to": user_name,
//   "item_id": item_mongoid,
//   "reply_time": "20210404",
//   "content": "This is a comment from user x",
//   "reported_by": user_mongoid
// }
app.post(
  "/api/items/:item_mongoId/comments",
  mongoChecker,
  authenticate,
  async (req, res) => {
    const currentItemMongoId = req.params.item_mongoId;
    try {
      const repliedUsername = req.body.reply_to;
      let repliedUserMongoId = undefined;
      if (repliedUsername !== null) {
        const repliedUserDocument = await User.findOne({
          user_name: repliedUsername,
        });
        repliedUserMongoId = repliedUserDocument._id;
      } else {
        repliedUserMongoId = null;
      }
      const currentItemDocument = await Item.findById(currentItemMongoId);
      const newCommentId = currentItemDocument.comments.length + 1;
      const newComment = new Comment({
        comment_id: newCommentId,
        visible: true,
        author: req.body.author, // user id
        reply_to: repliedUserMongoId, // user id
        item_id: currentItemMongoId, // item id
        reply_time: req.body.reply_time,
        content: req.body.content,
        reported_by: req.body.reported_by, // user id
      });
      const savedCommentDocument = await newComment.save();
      currentItemDocument.comments.unshift(savedCommentDocument._id);
      const savedCurrentItemDocument = await currentItemDocument.save();
      res.send({
        savedCurrentItemDocument: savedCurrentItemDocument,
      });
    } catch (error) {
      if (isMongoError(error)) {
        // check for if mongo server suddenly disconnected before this request.
        res.status(500).send("Internal server error");
      } else {
        log(error);
        res.status(400).send("Bad Request"); // bad request for changing the student.
      }
    }
  }
);

// *** FOR ADMIN USE ONLY ***
// a GET route to get all regular users
app.get(
  "/api/admin/users",
  mongoChecker,
  authenticateAdmin,
  async (req, res) => {
    // Get the users
    try {
      const users = await User.find({ user_type: "regular" });
      res.send(users); // just the array
      //res.send({ students }) // can wrap students in object if want to add more properties
    } catch (error) {
      log(error);
      res.status(500).send("Internal Server Error");
    }
  }
);

// a GET route to get all items
app.get(
  "/api/admin/items",
  mongoChecker,
  authenticateAdmin,
  async (req, res) => {
    // Get the users
    try {
      const items = await Item.find();
      res.send(items); // just the array
      //res.send({ students }) // can wrap students in object if want to add more properties
    } catch (error) {
      log(error);
      res.status(500).send("Internal Server Error");
    }
  }
);

// a PATCH route to delete/activate item: set item.deleted = true/false
// {"op": "replace", "path": "/deleted", "value":true}
app.patch("/api/admin/items/:id", authenticateAdmin, async (req, res) => {
  const item_id = req.params.id;
  if (!ObjectID.isValid(item_id)) {
    res.status(404).send();
    return; // so that we don't run the rest of the handler.
  }

  // Find the fields to update and their values.
  const fieldsToUpdate = {};
  req.body.map((change) => {
    const propertyToChange = change.path.substr(1); // getting rid of the '/' character
    fieldsToUpdate[propertyToChange] = change.value;
  });

  try {
    const item = await Item.findOneAndUpdate(
      { _id: item_id },
      { $set: fieldsToUpdate },
      { new: true, useFindAndModify: false }
    );
    if (!item) {
      res.status(404).send("Resource not found");
    } else {
      res.send(item);
    }
  } catch (error) {
    log(error);
    if (isMongoError(error)) {
      // check for if mongo server suddenly dissconnected before this request.
      res.status(500).send("Internal server error");
    } else {
      res.status(400).send("Bad Request"); // bad request for changing the item.
    }
  }
});

// a PATCH route to ban/activate user: set user.banned = true/false
// {"op": "replace", "path": "/banned", "value":true}
app.patch(
  "/api/admin/users/:id",
  mongoChecker,
  authenticateAdmin,
  async (req, res) => {
    const user_id = req.params.id;
    if (!ObjectID.isValid(user_id)) {
      res.status(404).send();
      return; // so that we don't run the rest of the handler.
    }

    // Find the fields to update and their values.
    const fieldsToUpdate = {};
    req.body.map((change) => {
      const propertyToChange = change.path.substr(1); // getting rid of the '/' character
      fieldsToUpdate[propertyToChange] = change.value;
    });

    try {
      const user = await User.findOneAndUpdate(
        { _id: user_id },
        { $set: fieldsToUpdate },
        { new: true, useFindAndModify: false }
      );
      if (!user) {
        res.status(404).send("Resource not found");
      } else {
        res.send(user);
      }
    } catch (error) {
      log(error);
      if (isMongoError(error)) {
        // check for if mongo server suddenly dissconnected before this request.
        res.status(500).send("Internal server error");
      } else {
        res.status(400).send("Bad Request"); // bad request for changing the item.
      }
    }
  }
);

// a GET route to get all pending reports
app.get(
  "/api/admin/reports",
  mongoChecker,
  authenticateAdmin,
  async (req, res) => {
    // Get the users
    try {
      const reports = await Report.find({ decision: "pending" });
      res.send(reports); // just the array
    } catch (error) {
      log(error);
      res.status(500).send("Internal Server Error");
    }
  }
);

// a GET route to get current report reporter/reportee
app.get("/api/admin/users/:id", mongoChecker, async (req, res) => {
  const user_id = req.params.id;
  if (!ObjectID.isValid(user_id)) {
    res.status(404).send();
    return; // so that we don't run the rest of the handler.
  }

  // If id valid, findById
  try {
    const user = await User.findById(user_id);
    if (!user) {
      res.status(404).send("Resource not found"); // could not find this student
    } else {
      res.send(user);
    }
  } catch (error) {
    if (isMongoError(error)) {
      // check for if mongo server suddenly disconnected before this request.
      res.status(500).send("Internal server error");
    } else {
      log(error);
      res.status(400).send("Bad Request"); // bad request for changing the student.
    }
  }
});

// a GET route to get current report comment
app.get("/api/admin/comments/:id", mongoChecker, async (req, res) => {
  const comment_id = req.params.id;
  if (!ObjectID.isValid(comment_id)) {
    res.status(404).send();
    return; // so that we don't run the rest of the handler.
  }

  // If id valid, findById
  try {
    const comment = await Comment.findById(comment_id);
    if (!comment) {
      res.status(404).send("Resource not found"); // could not find this student
    } else {
      res.send(comment);
    }
  } catch (error) {
    if (isMongoError(error)) {
      // check for if mongo server suddenly disconnected before this request.
      res.status(500).send("Internal server error");
    } else {
      log(error);
      res.status(400).send("Bad Request"); // bad request for changing the student.
    }
  }
});

// a PATCH route to update report decision
// {"op": "replace", "path": "/decision", "value":{status}}
app.patch(
  "/api/admin/reports/:id",
  mongoChecker,
  authenticateAdmin,
  async (req, res) => {
    const report_id = req.params.id;
    if (!ObjectID.isValid(report_id)) {
      res.status(404).send();
      return; // so that we don't run the rest of the handler.
    }

    // Find the fields to update and their values.
    const fieldsToUpdate = {};
    req.body.map((change) => {
      const propertyToChange = change.path.substr(1); // getting rid of the '/' character
      fieldsToUpdate[propertyToChange] = change.value;
    });

    try {
      const report = await Report.findOneAndUpdate(
        { _id: report_id },
        { $set: fieldsToUpdate },
        { new: true, useFindAndModify: false }
      );
      if (!report) {
        res.status(404).send("Resource not found");
      } else {
        res.send(report);
      }
    } catch (error) {
      log(error);
      if (isMongoError(error)) {
        // check for if mongo server suddenly dissconnected before this request.
        res.status(500).send("Internal server error");
      } else {
        res.status(400).send("Bad Request"); // bad request for changing the item.
      }
    }
  }
);

// a PATCH route to update comment
// {"op": "replace", "path": "/visible", "value":false}
app.patch(
  "/api/admin/comments/:id/:user_id",
  mongoChecker,
  authenticateAdmin,
  async (req, res) => {
    const comment_id = req.params.id;
    const user_id = req.params.user_id;

    if (!ObjectID.isValid(comment_id)) {
      res.status(404).send();
      return; // so that we don't run the rest of the handler.
    }

    if (!ObjectID.isValid(user_id)) {
      res.status(404).send();
      return; // so that we don't run the rest of the handler.
    }

    // Find the fields to update and their values.
    const fieldsToUpdate = {};
    req.body.map((change) => {
      const propertyToChange = change.path.substr(1); // getting rid of the '/' character
      fieldsToUpdate[propertyToChange] = change.value;
    });

    try {
      // delete comment
      const comment = await Comment.findOneAndUpdate(
        { _id: comment_id },
        { $set: fieldsToUpdate },
        { new: true, useFindAndModify: false }
      );
      if (!comment) {
        res.status(404).send("Resource not found");
      } else {
        /*res.send(comment);*/
        // decrease user's credit point
        const curUser = await User.findById(user_id);
        if (!curUser) {
          res.status(404).send("Resource not found");
        } else {
          curUser.credit_point -= 1;
          const savedUser = await curUser.save();
          if (!savedUser) {
            res.status(404).send("Resource not found");
          } else {
            res.send({ comment: comment, user: savedUser });
          }
        }
      }
      // decrease user's credit point
      //const curUser = await User.findById(user_id)
      //if (!curUser) {
      //    res.status(404).send("Resource not found");
      //} else {
      //    curUser.credit_point -= 1;
      //    const savedUser = await curUser.save();
      //    if (!savedUser) {
      //        res.status(404).send("Resource not found");
      //    } else {
      //        res.send({ comment: comment, user: savedUser });
      //    }
      //}
    } catch (error) {
      log(error);
      if (isMongoError(error)) {
        // check for if mongo server suddenly dissconnected before this request.
        res.status(500).send("Internal server error");
      } else {
        res.status(400).send("Bad Request"); // bad request for changing the item.
      }
    }
  }
);

/*** Webpage routes below **********************************/
// app.get("/Profile", (req, res) => {
//   if (!req.session.user) {
//     res.redirect("/Login");
//   }
//   // else{
//   //   res.redirect("/Profile")
//   // }
// });

// Serve the build
app.use(express.static(path.join(__dirname, "/client/build")));

// All routes other than above will go to index.html
app.get("*", (req, res) => {
  // check for page routes that we expect in the frontend to provide correct status code.
  const goodPageRoutes = [
    "/",
    "/Profile",
    "/Profile/Add_item",
    "/Login",
    "/Register",
    "/RegistrationSuccess",
    "/Shopping_Cart",
    "/Item_Listing",
    "/Admin/Dashboard",
    "/Admin/All_Users",
    "/Admin/All_Items",
    "/Admin/Reports",
    "/AboutUs",
  ];
  if (!goodPageRoutes.includes(req.url)) {
    // if url not in expected page routes, set status to 404.
    // res.status(404);
    res.sendFile(path.join(__dirname, "/client/build/404.html"));
  }

  // send index.html
  res.sendFile(path.join(__dirname, "/client/build/index.html"));
});

/*************************************************/
// Express server listening...
const port = process.env.PORT || 5000;
app.listen(port, () => {
  log(`Listening on port ${port}...`);
});
