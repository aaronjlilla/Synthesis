import React, { Component } from 'react';
import '../App.css';

class SmallBox extends Component {
    constructor(props) {
        super(props);

        this.sendItem = this.sendItem.bind(this);
    }

    sendItem(item) {
        this.props.sendData(item);
    }

    render() {
        return(
            <div className="boxsmall" onClick={() => this.sendItem(this.props.array)}>
                <div className="leagueoflegends"><div className="dot_synth">{this.props.array.length - 1}</div></div>
            </div>
        );
    }

}

export default SmallBox;