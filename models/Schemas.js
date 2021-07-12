const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/* mongoose schemas */
// Regular Users
const CommentSchema = new mongoose.Schema({
  comment_id: Number,
  visible: Boolean,
  author: mongoose.Schema.Types.ObjectId, // user id
  reply_to: mongoose.Schema.Types.ObjectId, // user id
  item_id: mongoose.Schema.Types.ObjectId, // item id
  reply_time: String,
  content: String,
  reported_by: mongoose.Schema.Types.ObjectId, // user id
});

const ItemSchema = new mongoose.Schema({
  item_id: Number,
  item_name: String,
  owner: Number, // user id
  pictures: [String], // Figure out how to store images
  description: String,
  price: Number,
  available: Boolean,
  comments: [mongoose.Schema.Types.ObjectId],
  deleted: Boolean,
});

//User Table
const UserSchema = new mongoose.Schema({
  user_id: Number,
  user_name: String,
  password: String,
  user_type: String,
  banned: Boolean,
  credit_point: Number,
  item_list: [mongoose.Schema.Types.ObjectId],
  profilePic: [String], // Figure out how to store images
  cart: [mongoose.Schema.Types.ObjectId],
  purchased: [mongoose.Schema.Types.ObjectId],
});

// Admin
const ReportSchema = new mongoose.Schema({
  report_id: Number, // int
  reporter: mongoose.Schema.Types.ObjectId, // user_id
  reportee: mongoose.Schema.Types.ObjectId, // user_id
  reported_item: mongoose.Schema.Types.ObjectId, // item object
  reported_comment: mongoose.Schema.Types.ObjectId, // comment oject
  decision: String, // string: active. resolved
});

const AdminSchema = new mongoose.Schema({
  user_id: Number, // int
  user_name: String, // string
  password: String, // string
  user_type: String, // "admin"
  unhandled_reports: [mongoose.Schema.Types.ObjectId], // array of report object
  handled_reports: [mongoose.Schema.Types.ObjectId], // array of report object
});

UserSchema.statics.findByUsernamePassword = function (username, password) {
  const User = this; // binds this to the User model
  // if (username !== "admin") {
  // First find the user by their email
  return User.findOne({ user_name: username }).then((user) => {
    if (!user) {
      return Promise.reject({ loginStatus: "error" }); // a rejected promise
    }
    // if the user exists, make sure their password is correct
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          if (user.user_name !== "admin") {
            if (!user.banned) {
              resolve(user);
            } else {
              reject({ loginStatus: "banned" });
            }
          } else {
            resolve(user);
          }
          resolve(user);
        } else {
          reject();
        }
      });
      // if (user.password === password) {
      //   if (user.user_name !== "admin") {
      //     if (!user.banned) {
      //       resolve(user);
      //     } else {
      //       reject({ loginStatus: "banned" });
      //     }
      //   } else {
      //     resolve(user);
      //   }
      // } else {
      //   reject({ loginStatus: "error" });
      // }

      //   bcrypt.compare(password, user.password, (err, result) => {
      //     if (result) {
      //       resolve(user);
      //     } else {
      //       reject();
      //     }
      //   });
    });
  });
  // }
  // else {
  //   // First find the user by their email
  //   return Admin.findOne({ user_name: username }).then((user) => {
  //     if (!user) {
  //       return Promise.reject({ loginStatus: "error" }); // a rejected promise
  //     }
  //     // if the user exists, make sure their password is correct
  //     return new Promise((resolve, reject) => {
  //       if (user.password === password) {
  //         {
  //           resolve(user);
  //         }
  //       } else {
  //         reject({ loginStatus: "error" });
  //       }

  //       //   bcrypt.compare(password, user.password, (err, result) => {
  //       //     if (result) {
  //       //       resolve(user);
  //       //     } else {
  //       //       reject();
  //       //     }
  //       //   });
  //     });
  //   });
  // }
};

// An example of Mongoose middleware.
// This function will run immediately prior to saving the document
// in the database.
UserSchema.pre("save", function (next) {
  const user = this; // binds this to User document instance

  // checks to ensure we don't hash password more than once
  if (user.isModified("password")) {
    // generate salt and hash the password
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

/* mongoose models */
// RU
const User = mongoose.model("User", UserSchema);
const Item = mongoose.model("Item", ItemSchema);
const Comment = mongoose.model("Comment", CommentSchema);

// Admin
const Admin = mongoose.model("Admin", AdminSchema);
const Report = mongoose.model("Report", ReportSchema);

module.exports = {
  User,
  Item,
  Comment,
  Admin,
  Report,
};
