class comment {
  constructor(
    comment_id,
    visible,
    author,
    reply_to,
    item_id,
    reply_time,
    content,
    reported_by
  ) {
    this.comment_id = comment_id; // int
    this.visible = visible;
    this.author = author; // user id
    this.reply_to = reply_to; // user id
    this.item_id = item_id; // item id
    this.reply_time = reply_time; //string?
    this.content = content; // string
    this.reported_by = reported_by; // single user id
  }
}

class item {
  constructor(
    item_id,
    item_name,
    owner,
    pictures,
    description,
    price,
    available,
    comments,
    deleted
  ) {
    this.item_id = item_id; // int
    this.item_name = item_name; // string
    this.owner = owner; // user id
    this.pictures = pictures; // array of item pictures
    this.description = description;
    this.price = price; // float
    this.available = available; // bool
    this.comments = comments; // array of comments
    this.deleted = deleted; // bool
  }
}

class user {
  constructor(
    user_id,
    user_name,
    password,
    user_type,
    banned,
    credit_point,
    item_list,
    profilePic,
    cart,
    purchased
  ) {
    this.user_id = user_id; //int
    this.user_name = user_name; // string
    this.password = password; // string
    this.user_type = user_type; // "regular"
    this.banned = banned; // bool
    this.credit_point = credit_point; // float
    this.item_list = item_list; // array of item_id
    this.profilePic = profilePic; //profile picture
    this.cart = cart; // array of item_id
    this.purchased = purchased;
  }
}

class admin {
  constructor(
    user_id, // int
    user_name, // string
    password, // string
    user_type, // "admin"
    unhandled_reports, // array of report object
    handled_reports // array of report object
  ) {
    this.user_id = user_id;
    this.user_name = user_name;
    this.password = password;
    this.user_type = user_type;
    this.unhandled_reports = unhandled_reports;
    this.handled_reports = handled_reports;
  }
}

class report {
  constructor(
    report_id, // int
    reporter, // user_id
    reportee, // user_name
    reported_item, // item mongoId
    reported_comment, // comment mongoId
    decision // string: active. resolved
  ) {
    this.report_id = report_id;
    this.reporter = reporter;
    this.reportee = reportee;
    this.reported_item = reported_item;
    this.reported_comment = reported_comment;
    this.decision = decision;
  }
}

export { comment, item, user, admin, report };
