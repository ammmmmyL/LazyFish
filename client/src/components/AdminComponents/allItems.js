import React from "react";
import {
    Table,
    Button,
}
    from 'react-bootstrap'
import { getAllItems, deactivateItem, activateItem } from "./../../actions/adminActions"

class AllItem extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        itemList: [],
    }

    componentDidMount() {
        getAllItems(this);
    }

    handleDeactivateItem = async (main, item) => {
        // update
        await deactivateItem(item._id);
        // get new itemList
        await getAllItems(main);
    };

    handleActivateItem = async (main, item) => {
        // update
        await activateItem(item._id);
        // get new itemList
        await getAllItems(main);
    };

    render() {

        const items = this.state.itemList

        return (

            <Table hover id="admin-main" className="container allUserTable">
                <thead>
                    <tr>
                        <th>Item ID</th>
                        <th>Item Name</th>
                        <th>Sold</th>
                        <th>Owner</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => {
                        let sold = "No"
                        if (item.available === false) {
                            sold = "Yes"
                        }
                        let status = "active"
                        if (item.deleted === true) {
                            status = "deleted"
                        }
                        return (
                            <tr>
                                <td>{item.item_id}</td>
                                <td>{item.item_name}</td>
                                <td>{sold}</td>
                                <td>{item.owner}</td>
                                <td>{status}</td>
                                <td>
                                    {item.deleted === false ? (
                                        <Button id="solveButton"
                                            type="submit"
                                            onClick={
                                                () => this.handleDeactivateItem(this, item)
                                            }
                                        >
                                            Delete
                                        </Button>
                                    ) : (
                                            <Button id="solveButton"
                                                type="submit"
                                                onClick={
                                                    () => this.handleActivateItem(this, item)
                                                }
                                            >
                                                Activate
                                            </Button>
                                        )}
                                </td>
                            </tr>
                        )
                    }
                    )}
                </tbody>
            </Table>

        )
    }
}


export default AllItem;