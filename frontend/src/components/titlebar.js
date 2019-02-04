import React, { Component } from 'react';
import '../App.css';

class TitleBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            chat: true
        }

        this.updateChat = this.updateChat.bind(this);
        this.sendFullscreen = this.sendFullscreen.bind(this);
    }

    updateChat() {
        this.setState({chat: !this.state.chat});
        this.props.chatupdate();
    }

    sendFullscreen() {
        this.props.fullScreenSent();
    }

    render() {
        return(
            <div id="right_topbar">
                <div className="dot_red"></div>
                <div id="right_top_names">
                <strong>Now Watching:</strong>
                </div>
                {
                    this.props.game.map(item => {
                        if (item.name && item.Status === "Live") {
                            return <div className="playersmallright"><div className="playersmallrightname">{item.name}</div></div>
                        }
                        else {
                            return false;
                        }
                    })
                }
                <div className="chatbutton" onClick={this.updateChat}>
                {this.state.chat && <div className="chatbuttontext">Disable Chat</div>}
                {!this.state.chat && <div className="chatbuttontext">Enable Chat</div>}
                </div>
                <div className="chatbutton" onClick={this.sendFullscreen}>
                    <div className="chatbuttontext">Go Fullscreen</div>
                </div>
            </div>
        );
    }
}

export default TitleBar;