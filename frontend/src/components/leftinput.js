import React, { Component } from 'react';
import '../App.css';
import LeftInputExpanded from './leftinputexpanded';

class LeftInput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activated: false,
            expanded: false,
            input: "",
            results: []
        }
        this.searchActive = this.searchActive.bind(this);
        this.expandSearch = this.expandSearch.bind(this);
        this.collapseSearch = this.collapseSearch.bind(this);
        this.keepOpen = this.keepOpen.bind(this);
        this.getData = this.getData.bind(this);
        this.lookupPlayer = this.lookupPlayer.bind(this);
    }

    expandSearch() {
        this.setState({expanded: !this.state.expanded});
    }

    collapseSearch(e) {
        this.setState({expanded: !this.state.expanded});
    }

    keepOpen() {
        this.setState({expanded: true});
    }
    
    getData(val) {
        this.props.sendData(val);
    }

    lookupPlayer(val) {
        let result;
        fetch('https://synthesis.gg:8443/test')
        .then(res => {
            return res.json();
        })
        .then(data => {
            data.map(game => {
                game.map(item => {
                    if (item.name === val) {
                        game.livegames = false;
                        game.map(item => {
                            if (item.Status === "Live") {
                                game.livegames = true;
                            }
                            return false;
                        })
                        result = game;
                    }
                    return false;
                })
                return false;
            })
            this.getData(result);
        })
        .catch(error => console.log(error));
    }

    searchActive(e) {
        var result = [];
        this.setState({input: e.target.value});
        let value = String(e.target.value).toLowerCase();
        fetch('https://synthesis.gg:8443/test')
        .then(res => {
            return res.json();
        })
        .then(data => {
            data.map(game => {
                for (var i = 0; i < game.length; i++) {
                    if (game[i].name && value !== "") {
                        if (game[i].name.toLowerCase().startsWith(value)) {
                            result.push({ "name" : game[i].name, "streamId" : game[i].streamId, "summonerId" : game[i].summonerId, "status" : game[i].Status});
                        }
                    }
                }
                return false;
            })
            if (result.length > 0) {
                this.setState({results: result});
            }
            else {
                this.setState({results: []});
            }
            //console.log(this.state.results);
        })
        .catch(error => console.log(error));
    }

    render() {
        return(
            <div id="leftsearchinput">
                <input placeholder="Search for streamer ingame..." value={this.state.input} spellCheck="false" onChange={this.searchActive} onFocus={this.expandSearch} onBlur={this.collapseSearch}/>
                {this.state.expanded && <LeftInputExpanded sendData={this.getData} results={this.state.results} sendPlayer={this.lookupPlayer}/>}
            </div>
        );
    }
}

export default LeftInput;