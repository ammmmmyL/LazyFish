import React from "react";
import {
    Table,
    Button
}
    from 'react-bootstrap'
import { getAllUsers, banUser, activateUser } from "./../../actions/adminActions"

class AllUser extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        userList: [],
    }

    componentDidMount() {
        getAllUsers(this);
    }

    handleActivateUser = async (main, user) => {
        // update
        await activateUser(user._id);
        // get new userList
        await getAllUsers(main);
    };

    handleBanUser = async (main, user) => {
        // update
        await banUser(user._id);
        // get new userList
        await getAllUsers(main);
    };

    render() {
        console.log("in Admin-All Users")
        const users = this.state.userList
        console.log(this.state)

        return (
            <Table hover id="admin-main" className="container allUserTable">
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>User Name</th>
                        <th>Credit Point</th>
                        <th>Total Listing</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => {
                        let status = "active"
                        if (user.banned === true) {
                            status = "banned"
                        }
                        return (
                            <tr>
                                <td >{user.user_id}</td>
                                <td>{user.user_name}</td>
                                <td>{user.credit_point}</td>
                                <td>{user.item_list.length}</td>
                                <td>{status}</td>
                                <td>
                                    {user.banned === false ? (
                                        <Button id="solveButton"
                                            type="submit"
                                            onClick={
                                                () => this.handleBanUser(this, user)
                                            }
                                        >
                                            Ban
                                        </Button>
                                    ) : (
                                            <Button id="solveButton"
                                                type="submit"
                                                onClick={
                                                    () => this.handleActivateUser(this, user)
                                                }
                                            >
                                                Activate
                                            </Button>
                                        )}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table >
        )
    }
}

export default AllUser;