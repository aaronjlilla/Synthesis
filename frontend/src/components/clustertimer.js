import React, { Component } from 'react';
import '../App.css';

class ClusterTimer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timer: 30
        }

        this.setTime = this.setTime.bind(this);
        this.sendUpdateRequest = this.sendUpdateRequest.bind(this);
    }

    setTime() {
        if (this.state.timer > 0) {
            this.setState({timer: this.state.timer - 1});
        }
        else {
            this.sendUpdateRequest();
            this.setState({timer: 30});
        }
    }

    sendUpdateRequest() {
        this.props.getUpdate();
    }

    componentDidMount() {
        this.setTime();
        setInterval(this.setTime, 1000);
    }

    render() {
        return(
            <div>
            {this.props.live && <div id="clustertimer">UPDATING LIST IN {this.state.timer} - {this.props.total} TOTAL</div>}
            {!this.props.live && <div id="clustertimer">UPDATE {this.state.timer}</div>}
            </div>
        );
    }
}

export default ClusterTimer;