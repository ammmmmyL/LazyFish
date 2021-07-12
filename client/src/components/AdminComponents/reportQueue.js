import React from "react";
import {
    Container
}
    from 'react-bootstrap'

import './../../css/dashboard_style.css'

import ReportItem from './reportItem'
import { getAllReports } from "./../../actions/adminActions"

class ReportQueue extends React.Component {

    state = {
        reportList: []
    }

    componentDidMount() {
        getAllReports(this)
    }

    render() {

        const reports = this.state.reportList

        return (
            <Container fluid="sm" id="admin-main">
                <h2>Report Handlings</h2>
                {reports.map((report) => {
                    //console.log(report)
                    //if (report.decision === "pending") {
                    return (
                        <ReportItem
                            queue={this}
                            item={report}
                        />
                        )
                    //}
                })}
            </Container>
        );
    }
}

export default ReportQueue;