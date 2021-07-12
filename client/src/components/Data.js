import { comment, item, user, admin, report } from "./Objects";
import cake from "../img/cake.jpg";
import w1 from "../img/homepage/vin_camera.jpg";
import p1 from "../img/homepage/p1.jpg";
import p2 from "../img/homepage/p2.jpg";
import p3 from "../img/homepage/p3.jpg";
import p4 from "../img/homepage/p4.jpg";
import profilePic from "../img/SpongeBob.jpg";
import profilePic2 from "../img/profile2.jpg";
const user1 = new user(
  1,
  "user1",
  "user1",
  "regular",
  false,
  5,
  [1, 2, 3, 7, 8, 9, 10],
  profilePic,
  [4, 5, 6],
  []
);
const user2 = new user(
  2,
  "user2",
  "user2",
  "regular",
  false,
  5,
  [4, 5, 6, 11, 12, 13, 14],
  profilePic2,
  [],
  []
);

const comment1 = new comment(
  1,
  true,
  2,
  null,
  1,
  "2020.02.03 11:43pm",
  "Hey this camera is great!",
  null
  // false,
  // ""
);
const comment2 = new comment(
  2,
  true,
  1,
  2,
  1,
  "2020.02.03 11:52pm",
  "I'm glad you like it!",
  null
  // false,
  // ""
);
const comment3 = new comment(
  3,
  true,
  2,
  null,
  1,
  "2020.02.03 11:43pm",
  "I wanna buy it",
  null
  // false,
  // ""
);
const item1 = new item(
  1,
  "camera 1",
  1,
  [p1, p2, p3, p4],
  "This is a great item! Come to buy it!",
  111.111,
  true,
  [comment3, comment2, comment1],
  false
);

const item2 = new item(
  2,
  "camera 2",
  1,
  [p1, p2, p3, p4],
  "This is a great item! Come to buy it!",
  222.222,
  true,
  [],
  false
);

const item3 = new item(
  3,
  "camera 3",
  1,
  [p1, w1],
  "This is a great item! Come to buy it!",
  3.33,
  true,
  [],
  false
);

const item4 = new item(
  4,
  "camera 4",
  2,
  [p2, p3],
  "This is a great item! Come to buy it!",
  44.4,
  true,
  [],
  false
);

const item5 = new item(
  5,
  "camera 5",
  2,
  [p3, p4, w1, p1],
  "This is a great item! Come to buy it!",
  555.55,
  true,
  [],
  false
);
const item6 = new item(
  6,
  "camera 6",
  2,
  [p4, w1],
  "This is a great item! Come to buy it!",
  6.6,
  true,
  [],
  false
);

const invalid = new item(
  7,
  "Invalid Item",
  2,
  [p1, p2, p3, p4],
  "This is a great item! Come to buy it!",
  222.222,
  false,
  [],
  false
);

const item8 = new item(
  8,
  "camera 8",
  2,
  [p1, p2, p3, p4],
  "This is a great item! Come to buy it!",
  88.8,
  true,
  [comment3, comment2, comment1],
  false
);

const item9 = new item(
  9,
  "camera 9",
  2,
  [p1, p2, p3, p4],
  "This is a great item! Come to buy it!",
  222.222,
  true,
  [],
  false
);

const item10 = new item(
  10,
  "camera 10",
  2,
  [p1],
  "This is a great item! Come to buy it!",
  3.33,
  true,
  [],
  false
);

const item11 = new item(
  11,
  "camera 11",
  2,
  [p2, p3],
  "This is a great item! Come to buy it!",
  44.4,
  true,
  [],
  false
);

const item12 = new item(
  12,
  "camera 12",
  2,
  [p1, p2, p3, p4],
  "This is a great item! Come to buy it!",
  555.55,
  true,
  [],
  false
);

const item13 = new item(
  13,
  "camera 13",
  2,
  [p4, w1],
  "This is a great item! Come to buy it!",
  6.6,
  true,
  [],
  false
);

const invalid2 = new item(
  14,
  "Invalid Item 2",
  2,
  [cake, cake, cake, cake],
  "This is a great item! Come to buy it!",
  222.222,
  false,
  [],
  false
);

//const report1 = new report(1, 1, 2, 1, comment1, "pending");

const admin1 = new admin(1, "admin", "admin", "admin", [], []);

const allReports = [];

const userList = {
  1: user1,
  2: user2,
};

const itemList = {
  1: item1,
  2: item2,
  3: item3,
  4: item4,
  5: item5,
  6: item6,
  7: invalid,
  8: item8,
  9: item9,
  10: item10,
  11: item11,
  12: item12,
  13: item13,
  14: invalid2,
};

const adminList = { 1: admin1 };

const currentItem = null;

const currentUser = null;

const userType = null;

export {
  userList,
  itemList,
  currentUser,
  currentItem,
  adminList,
  allReports,
  userType,
};
