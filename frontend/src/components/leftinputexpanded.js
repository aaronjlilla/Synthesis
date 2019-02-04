import React, { Component } from 'react';
import '../App.css';

class LeftInputExpanded extends Component {
    constructor(props) {
        super(props);
        this.passSummonerId = this.passSummonerId.bind(this);
        this.sendBackId = this.sendBackId.bind(this);
    }

    passSummonerId(data) {
        this.props.sendData(data);
    }

    sendBackId(id) {
        this.props.sendPlayer(id);
    }

    render() {
        return(
            <div className="arrow_box borders">
            { !this.props.results[0] && <div className="noresults">No results or empty!</div> }
            {
                this.props.results[0] 
                &&
                this.props.results.map(item => <div key={item.name} onMouseDown={() => this.sendBackId(item.name)} className="searchitemresult"><a className="searchitemresultname">{item.name}</a><a className={(item.status === "Live") ? "searchitemresultstatus live" : "searchitemresultstatus offline"}>{(item.status === "Live") ? "Streaming" : "In-Game"}</a></div>)
            }
            </div>
        );
    }
}

export default LeftInputExpanded;