import { get } from "mongoose";
import React from "react";
import { Row, Col, DropdownButton, Dropdown, Button } from "react-bootstrap";

import { removeReport } from "./../../actions/adminActions";

import './../../css/dashboard_style.css'

import { getReportComment, getReporter, getReportee } from "./../../actions/adminActions"

class ReportItem extends React.Component {
    state = {
        action: "",
        reporter: "",
        reportee: "",
        comment: ""
    };

    changeAction = (action) => {
        //console.log(action);
        this.setState({
            action: action,
        });
    };

    componentDidMount() {
        getReportComment(this, this.props.item.reported_comment)
        getReporter(this, this.props.item.reporter)
        getReportee(this, this.props.item.reportee)
    }

    render() {
        const { queue, item } = this.props;
        //console.log(this)
        return (
            <Row className="reportItem">
                <Col sm={9}>
                    <strong>Reporter User ID:</strong> {this.state.reporter}
                    <br />
                    <strong>Reportee User ID:</strong> {this.state.reportee}
                    <br />
                    <strong>Reported Comment:</strong> {this.state.comment.content}
                </Col>
                <Col sm={2} className="actionMenu">
                    {/*Functionalities of the buttons to be implemented once have data ready*/}
                    <DropdownButton
                        id="actionButton"
                        title={this.state.action === "" ? "Actions" : this.state.action}>
                        <Dropdown.Item
                            className="dropDownMenu"
                            onClick={() => this.changeAction("ban")}>
                            Ban User
                        </Dropdown.Item>
                        <Dropdown.Item
                            className="dropDownMenu"
                            onClick={() => this.changeAction("delete")}>
                            Delete Comment
                        </Dropdown.Item>
                        <Dropdown.Item
                            className="dropDownMenu"
                            onClick={() => this.changeAction("ignore")}>
                            Ignore
                        </Dropdown.Item>
                    </DropdownButton>
                </Col>
                <Col sm={1} className="actionMenu">
                    <Button
                        id="solveButton"
                        onClick={() => removeReport(queue, item, this)}>
                        Resolve
                    </Button>
                </Col>
            </Row>
        );
    }
}

export default ReportItem;
