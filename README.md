# Team 33 Group Project Phase 2 - Lazy Fish

Our project is called Lazy Fish, an e-commerce website for people to buy and sell second-handed cameras
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
```
npm install react-bootstrap bootstrap
```

## Deployed Website
Website Link: https://lazyfish.herokuapp.com/

## Instruction - Updated for Phase 2
> Home page

The landing page will be our homepage, if user is not logged in(guest users), they can only browse the homepage.
If guest users click on any pictures in the homepage or the cart icon, they will be directed to the login page
### Regular Users
> Login Page
```
Creditial:
Username: user1
Password: user1
```
For a second user view, please user *"user2/user2"*
New users can also register at the login page, and use their new registered creditials to login

*Update for Phase 2*
- We are using bcrypt for our authentication
- Upon login successful, a session will be created for the current user; the session will be destroyed upon logout

<br />

> Profile Page

Once logged in, users will be direct to their profile page displaying their relevant information:
- Listings of current user(still available)
- Sold Listings(already sold on the website)
- Favourites section is currently static and for styling only

*Update for Phase 2*
- Add a new listing by clicking "Add New Listing"
- User's rating reflects their credit score: 1 coloured star = 1 credit point, >=5 credit point = all stars coloured
<br />

> Add Item Page

Users can fill out informations for the new listing they want to post. If any fields are empty, a corresponding error message will be displayed. The "price" field will only accept "number" input. If the item is added successfully, a message in green will be displayed, and users can choose to return to their profile page will link provided.

*Update for Phase 2*
- upload files are hardcoded with dummy data as we could not get image upload API working in time
<br />

> Item Detail Page

Each item(profile, homepage, cart) is linked to their corresponding item listing detail page
The item's name, price, descriprion and seller's credit rating will be shown

````
credit point: 4-5 = good-credit; 
credit point: 2-4 = normal-credit; 
credit point: 0-2 = bad credit;
 ````

Users can chat with the seller by leaving *"comments"*, and owner of the item can reply
Users can also report replies they think are abusive
Item been added to cart will show up in cart by clicking the cart icon 

*Update for Phase 2*

User cannot add their own listings to cart, if the current user is the owner of the listing, add to car icon will be gray
<br />

> Cart 

Users can choose to 
- buy an item -> the item will be marked as sold
- delete the item from chart

### Admin
> Login Page
```
Creditial:
Username: admin
Password: admin
```
> Dashboard page.
- Sidebar Navigation Icons:
    - first icon links to the dashboard
    - second icon links to the report handling page
- Total Users: will show all users, and admin can ban a user or activate a banned user
  (banned users will not be able to login)
- Total Listings: will show all listings, and admin can delete / activate an item
  (deleted items will not be shown on homepage/profile)
- New Reports: link to Report handling page

> Report Handling page

- Show each report with its reporter, reportee, and the comment been reported
- Actions: admin can either 
    1. ban the user(the reportee);
    2. delete the comment(cause the reportee's credit point - 1, and the comment will not be visible on its item listimg page)
    3. ignore the report
- By click resolve, the action will be performed

### Changes from proposal:
- real-time chatting/leaving feedback has been changed to using *"comments"*
- payment is not implemented since third party APIs is too difficult and beyond our abilities

### Unimplemented functions (phase 2)
- search function: unable to search items using the search bar
- favourites: User's favourites are static and hardcoded in html
- edit listing function: not impletemented due to short of time
- upload images: cloudnary API not impletemented due to short of time

## Overview of the Routes (phase 2)
### User API Routes
```
// To create the admin in postman (not used for fetch data in frontend)
app.post("/api/createAdmin")
```
```
// A route to login and create a session
app.post("/api/users/login")
```
```
// A route to get Owner information of currentItem in itemListing page
app.get("/api/users/:user_id")
```
```
// A route to create new user
// Accept request body like
// {
//   "username": "user1",
//   "password": "user1"
// }
app.post("/api/users/registration")
```
### Item API Routes
```
// a GET route to get the number of items in database - for item_id in add item function
app.get("/api/addItem/items")
```
```
// a GET route to get all legal and available itmes
app.get("/api/items")
```
```
// a GET route to get a item by their id.
app.get("/api/items/:id")
```
```
// a POST route to add Item to specific user's item list
app.post("/api/:user_id/items")
```
```
// A GET route to get all comments under an item
app.get("/api/items/:item_mongoId/comments")
```
```
// A GET route to get all items in the cart
app.get("/api/users/cart/:user_mongoId")
```
```
// A POST route to buy item in the cart
app.post("/api/users/cart/buy/:user_mongoId/:item_mongoId")
```
```
// A POST route to delete item in the cart
app.post("/api/users/cart/delete/:user_mongoId/:item_mongoId")
```
```
// A POST route to add item to current user's cart
app.post("/api/users/cart/:item_mongoId/:user_mongoId")
```
```
/ A POST route to report a comment
// req.body be like this:
// {
//   "report_id": undefined, // int
//     "reporter": mongoId,
//     "reportee": user_id, // user_id
//     "reported_item": mongoId, // item object
//     "reported_comment": mongoId, // comment oject
//     "decision": undefined; // string: active. resolved
// }
app.post("/api/items/comments/:comment_mongoId")
```
```
// A POST route to add a comment under an item
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
app.post("/api/items/:item_mongoId/comments")
```
### Admin API Routes
```
// a GET route to get all regular users
app.get("/api/admin/users")
```
```
// a GET route to get all items
app.get("/api/admin/items")
```
```
// a PATCH route to delete/activate item: set item.deleted = true/false
// {"op": "replace", "path": "/deleted", "value":true}
app.patch("/api/admin/items/:id")
```
```
// a PATCH route to ban/activate user: set user.banned = true/false
// {"op": "replace", "path": "/banned", "value":true}
app.patch("/api/admin/users/:id")
```
```
// a GET route to get all pending reports
app.get(
  "/api/admin/reports"
```
```
// a GET route to get current report reporter/reportee
app.get("/api/admin/users/:id")
```
```
// a GET route to get current report comment
app.get("/api/admin/comments/:id")
```
```
// a PATCH route to update report decision
// {"op": "replace", "path": "/decision", "value":{status}}
app.patch("/api/admin/reports/:id")
```
```
// a PATCH route to update comment and decrese the user's credit point by 1
// {"op": "replace", "path": "/visible", "value":false}
app.patch("/api/admin/comments/:id/:user_id")
```

## Directory Structure
- /OLD_CODE have our previous pages before using React, please DO NOT MARK this folder, this is for REFERENCE ONLY
- /Group Proposal is our project proposal - for reference only
- /client contains the front end files
    - /client/src/actions have all the fetch call related functions
    - /client/src/components have all the reusable components files
    - /client/src/css have all the css file for different views
    - /client/src/img have all the static images
- server.js have the backend routes

```
team33
├── OLD_CODE
├── db
│   ├── mongoose.js
│   └── other test data json files (*.json: for testing only)
├── models
│   ├── Schemas.js (all data structure: User, Item, Report, Comment)
│   └── 
├── package.json
├── package-lock.json
├── README
├── Group Proposal
├── server.js (all routes)
└── client
    ├── public
    │   ├── index.html
    │   ├── 404.html
    │   └── ...
    ├── package.json
    ├── package-lock.json
    └── src
        ├── actions
        │   ├── adminActions.js
        │   ├── itemActions.js
        │   └── userActions.js
        ├── components
        │   ├── AdminComponents (all admin related components)
        │   │    └── ...
        │   └── ...
        ├── css
        │   └── ...
        ├── img
        |   └── ...
        ├── homepage.js
        ├── index.js (app entry)
        ├── LogIn.js
        ├── Main.js 
        ├── Profile.js
        ├── RegistrationSuccess.js
        ├── Shopping_Cart.js
        ├── config.js
        └── ...
        
```

## Library Used
css bootstrap: react-bootrap https://react-bootstrap.github.io/
```
npm install react-bootstrap bootstrap
```
Icon library: fontawesome https://fontawesome.com/how-to-use/on-the-web/using-with/react
```
npm i --save @fortawesome/fontawesome-svg-core
npm install --save @fortawesome/free-solid-svg-icons
npm install --save @fortawesome/react-fontawesome
```



