import React, { Component } from 'react';
import TitleBar from './titlebar';
import StreamBox from './streambox';
import StreamBoxBig from './streamboxbig';
import CustomScroll from 'react-custom-scroll';
import MediaQuery from 'react-responsive';
import Fullscreen from "react-full-screen";
import '../App.css';

class Right extends Component {
    constructor(props) {
        super(props);

        this.state = {
            playing: [],
            collapsed: false,
            isFull: false,
            chatEnabled: true,
            discord: true
        }

        this.goFull = this.goFull.bind(this);
        this.chatUpdate = this.chatUpdate.bind(this);
        this.closeDiscord = this.closeDiscord.bind(this);
    }

    goFull() {
        this.setState({isFull: true});
    }

    chatUpdate() {
        this.setState({chatEnabled: !this.state.chatEnabled});
    }

    closeDiscord() {
        this.setState({discord: false});
    }

    render() {
        let count = 0;
        let counter = 0;
        this.props.selected.map(item => {
            if (!item.gameId && item.Status !== "Offline") {
                counter = counter + 1;
            }
            return false;
        })
        return(
            <div id={this.props.bigscreen ? "right_bigscreen" : "right_smallscreen"}>
            {(this.props.selected.livegames && this.props.selected.length > 0) && <TitleBar chatupdate={this.chatUpdate} fullScreenSent={this.goFull} game={this.props.selected}/>}
            {(!this.props.selected.livegames && this.props.selected.length > 0) && <div className="errorbox"><strong>Error:</strong>There are no players streaming in this game. Please try another game!</div>}
            <CustomScroll heightRelativeToParent="calc(100% - 40px)">
            <Fullscreen
            enabled={this.state.isFull}
            onChange={isFull => this.setState({isFull})}
            >
                <div id="streamboxwrap">
                    {this.state.discord && <div><div className="discordx" onClick={this.closeDiscord}>✖</div><a onClick={this.closeDiscord} href="https://discord.gg/Whscp3E" target="_blank" className="discord"></a></div>}
                    <MediaQuery query="(min-width: 1250px)">
                        {
                            this.props.selected.map(item => {
                                if (!item.gameId && item.Status !== "Offline") {
                                    count = count + 1;
                                    return <StreamBox counter2={count} quantity={counter} name={item.name} streamid={item.streamId} chat={this.state.chatEnabled}/>
                                }
                                else {
                                    return false;
                                }
                            })
                        }
                    </MediaQuery>
                    <MediaQuery query="(max-width: 1249px)">
                        {
                            this.props.selected.map(item => {
                                if (!item.gameId && item.Status !== "Offline") {
                                    return <StreamBoxBig counter2={count} quantity={counter} name={item.name} streamid={item.streamId} chat={this.state.chatEnabled}/>
                                }
                                else {
                                    return false;
                                }
                            })
                        }
                    </MediaQuery>
                </div>
            </Fullscreen>
            </CustomScroll>
            </div>
        );
    }

}

export default Right;