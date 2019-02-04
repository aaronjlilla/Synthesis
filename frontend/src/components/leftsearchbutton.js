import React, { Component } from 'react';
import LeftInput from './leftinput';
import '../App.css';

class LeftSearchButton extends Component {
    constructor(props) {
        super(props);

        this.state = {
            toggle: false
        }

        this.toggleShow = this.toggleShow.bind(this);
        this.getData = this.getData.bind(this);
    }

    toggleShow() {
        this.setState({toggle: !this.state.toggle});
    }

    getData(val) {
        this.props.sendData(val);
    }

    render() {
        return (
            <div id={(this.state.toggle) ? "leftsearchbuttonexpanded" : "leftsearchbutton"}>
                {!this.state.toggle && <button onClick={this.toggleShow}/>}
                {this.state.toggle && <div className="close" onClick={this.toggleShow}>✖</div>}
                {this.state.toggle && <LeftInput sendData={this.getData}/>}
            </div>
        );
    }
}

export default LeftSearchButton;