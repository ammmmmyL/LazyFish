// environment configutations
import ENV from "./../config.js";
const API_HOST = ENV.api_host;

// function to send a GET request to the web server to get all users
export const getAllUsers = (adminDashboard) => {
    // the URL for the request
    const url = `${API_HOST}/api/admin/users`;

    // Since this is a GET request, simply call fetch on the URL
    fetch(url)
        .then(res => {
            if (res.status === 200) {
                // return a promise that resolves with the JSON body
                return res.json();
            } else {
                alert("Could not get users");
            }
        })
        .then(json => {
            console.log(json)
            // the resolved promise with the JSON body
            adminDashboard.setState({
                userList: json
            });
        })
        .catch(error => {
            console.log(error);
        });
};

// function to send a GET request to the web server to get all items
export const getAllItems = (adminDashboard) => {
    // the URL for the request
    const url = `${API_HOST}/api/admin/items`;

    // Since this is a GET request, simply call fetch on the URL
    fetch(url)
        .then(res => {
            if (res.status === 200) {
                // return a promise that resolves with the JSON body
                return res.json();
            } else {
                alert("Could not get items");
            }
        })
        .then(json => {
            //console.log(json)
            // the resolved promise with the JSON body
            adminDashboard.setState({
                itemList: json
            });
        })
        .catch(error => {
            console.log(error);
        });
};

// function to deactivate an item
export const deactivateItem = async (item_id) => {
    console.log("in deactivateItem")
    // fetch call
    const request = new Request(`${API_HOST}/api/admin/items/${item_id}`, {
        method: "PATCH",
        body: JSON.stringify([{ op: "replace", path: "/deleted", value: true }]),
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
        },
    });

    await fetch(request)
        .then(res => {
            //console.log(res)
            if (res.status === 200) {
                // return a promise that resolves with the JSON body
                return res;
                // update itemList               
            } else {
                alert("Could not patch item");
            }
        })
        .catch(error => {
            console.log(error);
        });
};

// function to activate an item
export const activateItem = async (item_id) => {

    console.log("in activateItem")
    // fetch call
    const request = new Request(`${API_HOST}/api/admin/items/${item_id}`, {
        method: "PATCH",
        body: JSON.stringify([{ op: "replace", path: "/deleted", value: false }]),
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
        },
    });

    await fetch(request)
        .then(res => {
            //console.log(res)
            if (res.status === 200) {
                // return a promise that resolves with the JSON body
                return res;
            } else {
                alert("Could not patch item");
            }
        })
        .catch(error => {
            console.log(error);
        });
};

// function to ban a user
export const banUser = async (user_id) => {
    console.log("in banUser");
    // fetch call
    const request = new Request(`${API_HOST}/api/admin/users/${user_id}`, {
        method: "PATCH",
        body: JSON.stringify([
            { op: "replace", path: "/banned", value: true },
            { op: "replace", path: "/credit_point", value: 0 }
        ]),
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
        },
    });

    await fetch(request)
        .then(res => {
            console.log(res)
            if (res.status === 200) {
                // return a promise that resolves with the JSON body
                return res;
            } else {
                alert("Could not patch user");
            }
        })
        .catch(error => {
            console.log(error);
        });
};

// function to activate a user
export const activateUser = async (user_id) => {
    console.log("in activateUser");
    // fetch call
    const request = new Request(`${API_HOST}/api/admin/users/${user_id}`, {
        method: "PATCH",
        body: JSON.stringify([{ op: "replace", path: "/banned", value: false }]),
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
        },
    });

    await fetch(request)
        .then(res => {
            //console.log(res)
            if (res.status === 200) {
                // return a promise that resolves with the JSON body
                return res;
            } else {
                alert("Could not patch user");
            }
        })
        .catch(error => {
            console.log(error);
        });
};

// function to send a GET request to the web server to get all pending reports
export const getAllReports = (adminDashboard) => {
    // the URL for the request
    const url = `${API_HOST}/api/admin/reports`;

    // Since this is a GET request, simply call fetch on the URL
    fetch(url)
        .then(res => {
            if (res.status === 200) {
                // return a promise that resolves with the JSON body
                // array
                return res.json();
            } else {
                alert("Could not get reports");
            }
        })
        .then(json => {
            console.log(json)
            // the resolved promise with the JSON body
            adminDashboard.setState({
                reportList: json
            });
        })
        .catch(error => {
            console.log(error);
        });
};

// function to send a GET request to the web server to get the reporter
export const getReporter = async (report, reporter) => {
    // the URL for the request
    const url = `${API_HOST}/api/admin/users/${reporter}`;

    // Since this is a GET request, simply call fetch on the URL
    await fetch(url)
        .then((res) => {
            if (res.status === 200) {
                // return a promise that resolves with the JSON body
                return res.json();
            } else {
                alert("Could not get user");
            }
        })
        .then((json) => {
            report.setState({
                reporter: json.user_id
            })
        })
        .catch((error) => {
            console.log(error);
        });
}

// function to send a GET request to the web server to get the reportee
export const getReportee = async (report, reportee) => {
    // the URL for the request
    const url = `${API_HOST}/api/admin/users/${reportee}`;

    // Since this is a GET request, simply call fetch on the URL
    await fetch(url)
        .then((res) => {
            if (res.status === 200) {
                // return a promise that resolves with the JSON body
                return res.json();
            } else {
                alert("Could not get user");
            }
        })
        .then((json) => {
            report.setState({
                reportee: json.user_id
            })
        })
        .catch((error) => {
            console.log(error);
        });
}

// function to send a GET request to the web server to get the reported comment
export const getReportComment = async (report, comment) => {
    // the URL for the request
    const url = `${API_HOST}/api/admin/comments/${comment}`;

    // Since this is a GET request, simply call fetch on the URL
    await fetch(url)
        .then((res) => {
            if (res.status === 200) {
                // return a promise that resolves with the JSON body
                return res.json();
            } else {
                alert("Could not get comment");
            }
        })
        .then((json) => {
            report.setState({
                comment: json
            })
        })
        .catch((error) => {
            console.log(error);
        });
}

// function to update report status
export const updateReportStatus = async (report, status) => {
    console.log("in updateReportStatus");
    // fetch call
    const request = new Request(`${API_HOST}/api/admin/reports/${report._id}`, {
        method: "PATCH",
        body: JSON.stringify([{ op: "replace", path: "/decision", value: status }]),
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
        },
    });

    await fetch(request)
        .then(res => {
            //console.log(res)
            if (res.status === 200) {
                // return a promise that resolves with the JSON body
                return res;
            } else {
                alert("Could not patch report");
            }
        })
        .catch(error => {
            console.log(error);
        });
}

// function to remove a report from reports list when it's done
export const removeReport = async (mainComponent, item, queue) => {
    console.log("in removeReport")
    console.log(queue);
    const action = queue.state.action
    if (action === "delete") {
        await deleteComment(item)
        const status = "comment deleted"
        await updateReportStatus(item, status)
        await getAllReports(queue.props.queue)
    }
    else if (action === "ban") {
        await banUser(item.reportee)
        const status = "user banned"
        await updateReportStatus(item, status)
        await getAllReports(queue.props.queue)
    }
    else if (action === "ignore") {
        await ignoreReport(item)
        const status = "Ignored"
        await updateReportStatus(item, status)
        await getAllReports(queue.props.queue)
    }

};

// function to delete comment
export const deleteComment = async (item) => {
    console.log("in deleteComment");

    // decrease reportee's credit point by 1
    // set comment to not visible
    const request = new Request(`${API_HOST}/api/admin/comments/${item.reported_comment}/${item.reportee}`, {
        method: "PATCH",
        body: JSON.stringify([{ op: "replace", path: "/visible", value: false }]),
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
        },
    });

    await fetch(request)
        .then(res => {
            //console.log(res)
            if (res.status === 200) {
                // return a promise that resolves with the JSON body
                return res;
            } else {
                alert("Could not patch comment");
            }
        })
        .catch(error => {
            console.log(error);
        });
};

// function to ignore report
export const ignoreReport = async (item) => {
    console.log("in ignoreReport");

    // fetch call
    const request = new Request(`${API_HOST}/api/admin/comments/${item.reported_comment}`, {
        method: "PATCH",
        body: JSON.stringify([{ op: "replace", path: "/reported_by", value: null }]),
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
        },
    });

    await fetch(request)
        .then(res => {
            //console.log(res)
            if (res.status === 200) {
                // return a promise that resolves with the JSON body
                return res;
            } else {
                alert("Could not patch comment");
            }
        })
        .catch(error => {
            console.log(error);
        });
};
