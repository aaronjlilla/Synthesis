import React, { Component } from 'react';
import ClusterTimer from './clustertimer';
import BigBox from './bigbox';
import SmallBox from './smallbox';
import CustomScroll from 'react-custom-scroll';
import '../App.css';

class Cluster extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        clusterdata: [],
        usablegames: [],
        firstload: true
      }
  
      this.fetchCluster = this.fetchCluster.bind(this);
      this.handleDisplay = this.handleDisplay.bind(this);
      this.getData = this.getData.bind(this);
      this.updateRequest = this.updateRequest.bind(this);
      this.clusterMap = 'test';
      this.gameIds = [];
    }
  
    handleDisplay(item) {
      //console.log(item);
      let index = this.state.clusterdata.indexOf(item);
      let copyofstate = Object.assign({}, this.state);
      copyofstate.clusterdata.map(item => {
        item.isHidden = true;
        return true;
      })
      copyofstate.clusterdata[index].isHidden = false;
      this.setState(copyofstate);
    }
  
    fetchCluster() {
        fetch('https://synthesis.gg:8443/test')
        .then(res => {
          return res.json();
        })
        .then(data => {
          let copyofstate = {};
          let usablegames = [];
          this.setState({ clusterdata: data });
          this.state.clusterdata.map(item => {
            let indexofitem = this.state.clusterdata.indexOf(item);
            copyofstate = Object.assign({}, this.state);
            copyofstate.clusterdata[indexofitem].isHidden = true;
            copyofstate.clusterdata[indexofitem].livegames = false;
            if (item.length > 2) {
                usablegames.push(item);
            }
            copyofstate.clusterdata.sort(function(a, b){
                // ASC  -> a.length - b.length
                // DESC -> b.length - a.length
                return b.length - a.length;
            });
            copyofstate.clusterdata.map(item => {
                if (item.length < 2) {
                    let indexof = copyofstate.clusterdata.indexOf(item);
                    copyofstate.clusterdata.splice(indexof, 1);
                }
                return false;
            })
            copyofstate.clusterdata.map(item => {
                let indexof = copyofstate.clusterdata.indexOf(item);
                item.map(items => {
                    if (items.Status === "Live") {
                        copyofstate.clusterdata[indexof].livegames = true;
                    }
                    return false;
                })
                return false;
            })
            copyofstate.clusterdata.map(item => {
                let indexof = copyofstate.clusterdata.indexOf(item);
                let count = 0;
                item.map(items => {
                    if (items.Status === "Live") {
                        count = count + 1;
                    }
                })
                copyofstate.clusterdata[indexof].currentlive = count;
                return false;
            })
            copyofstate.clusterdata.sort(function(a, b){
                // ASC  -> a.length - b.length
                // DESC -> b.length - a.length
                return b.currentlive - a.currentlive;
            });
            copyofstate.usablegames = usablegames;
            return true;
          }
          );
          this.setState(copyofstate);
          if (this.state.firstload) {
            this.setState({firstload: false});
            this.getData(this.state.clusterdata[0]);
          }
        })
        .catch(error => console.log(error));
    }
  
    componentDidMount() {
      this.fetchCluster();
    }

    updateRequest() {
        console.log("DICKS");
        this.fetchCluster();
    }

    getData(val) {
        this.props.sendData(val);
    }
  
    render() {
        let left;
        if ((this.props.window < 1250 && !this.props.active) || (this.props.logo === "left_mainlogo2" && this.props.active)) {
            //small btw
            left = false;
        }
        else {
            //big btw
            left = true;
        }
      return(
        <div id="clustermain">
            <div id={(left) ? "titlebig" : "titlesmall"}>
                {(left) ? "LIVE GAMES" : "GAMES"}
                <ClusterTimer getUpdate={this.updateRequest} live={left} total={this.state.clusterdata.length}/>
            </div>
                <CustomScroll heightRelativeToParent="100%">
                    <div id="cluster_gamewrap">
                        {left && this.state.clusterdata.map(item => <BigBox sendData={this.getData} array={item}/>)}
                        {!left && this.state.clusterdata.map(item => <SmallBox sendData={this.getData} array={item}/>)}
                    </div>
                </CustomScroll>
                <div id="footer">
                        {left && <div id="footertext"><strong>© 2018 Synthesis.gg</strong> - All Rights Reserved</div>}
                        {!left && <div id="footertext"><strong>© 2018</strong></div>}
                </div>
        </div>
      );
    }
  }

  export default Cluster;