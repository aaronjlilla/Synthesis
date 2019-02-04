import React, { Component } from 'react';
import '../App.css';

class BigBox extends Component {
    constructor(props) {
        super(props);

        this.sendItem = this.sendItem.bind(this);
    }

    sendItem(item) {
        this.props.sendData(item);
    }

    render() {
        return(
            <div className="boxbig" onClick={() => this.sendItem(this.props.array)}>
                <div className="leagueoflegendsbig">
                {
                    this.props.array.map(item => {
                        if (item.name) {
                            return <div className="playersmall"><div className="playersmall_name">{item.name}</div><div className="playersmall_status"><div className={(item.Status === "Live") ? "dot_green" : "dot_blue"}></div></div></div>
                        }
                        else {
                            return false;
                        }
                    }
                    )
                }
                </div>
            </div>
        );
    }

}

export default BigBox;