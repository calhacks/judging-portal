import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import '../JudgePortal.css';

class Project extends Component {
    render() {
        return(
            <div className="projectcmp">
                <div className="project-text">
                    <h3>{this.props.name}</h3>
                    <p>Wave: {this.props.wave} ID: {this.props.identification}</p>
                </div>
            </div>
        );
    }
}

export default withRouter(Project);
