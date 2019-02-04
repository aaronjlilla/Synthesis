import React, { Component } from 'react';
import MediaQuery from 'react-responsive';
import LeftInput from './leftinput';
import LeftSearchButton from './leftsearchbutton';
import Cluster from './cluster';
import '../App.css';

class Left extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        leftbar: false,
        activated: false,
        WindowSize : window.innerWidth
      }

      this.handleClick = this.handleClick.bind(this);
      this.handleResize = this.handleResize.bind(this);
      this.getData = this.getData.bind(this);
      this.sendBigscreen = this.sendBigscreen.bind(this);
      this.getArrayData = this.getArrayData.bind(this);
    }
  
    componentDidMount() {
      if (window.innerHeight > 1249) {
        this.setState({leftbar: false});
      }
      window.addEventListener("resize", this.handleResize);
    }
    componentWillUnmount() {
      window.addEventListener("resize", null);
    }
    handleResize(WindowSize, event) {
        this.setState({WindowSize: window.innerWidth})
    }
    handleClick() {
      this.setState({leftbar: !this.state.leftbar, activated: true});
    }
    getData(val) {
        console.log(val);
        this.props.sendData(val);
    }
    getArrayData(arr) {
        this.setState({leftbar: true, activated: true});
        this.props.sendArrayData(arr);
    }
    sendBigscreen(val) {
        this.props.sendBigRes(val);
    }
    
    render() {
      //{(!this.state.activated) ? (<input placeholder="Search for streamer ingame..." spellCheck="false" onChange={this.searchActive}/>) : input }
      let input = '';
      let mainlogo = '';
      let fix = "top-to-bottom fixed";
      let nofix = "top-to-bottom";
      if (this.state.leftbar) {
        mainlogo = "left_mainlogo2";
        input = (<div className="spacer"><LeftSearchButton sendData={this.getData}/></div>);
      }
      if (!this.state.leftbar) {
        mainlogo = "left_mainlogo";
        input = (<LeftInput activated={this.state.activated} sendData={this.getData}/>);
      }

      let bigscreenresult;
      if (mainlogo === "left_mainlogo") {
        bigscreenresult = false;
      }
      if (mainlogo === "left_mainlogo2") {
        bigscreenresult = true;
      }
      if (this.state.WindowSize > 1249 && !this.state.activated) {
        bigscreenresult = false;
      }
      if (this.state.WindowSize < 1250 && !this.state.activated) {
        bigscreenresult = true;
      }
      if (this.state.activated && mainlogo === "left_mainlogo") {
        bigscreenresult = false;
      }

      this.sendBigscreen(bigscreenresult);
      return (
          <div id={(this.state.WindowSize > 1249 && !this.state.activated) ? "left" : "left2" } className={(this.state.activated && mainlogo === "left_mainlogo") ? fix : nofix}>
          <MediaQuery minWidth={1250}>
            {(matches) => {
              if (matches) {
                return <div id={(this.state.activated) ? mainlogo : "left_mainlogo"} onClick={this.handleClick}></div>;
              } else {
                return <div id={(this.state.activated) ? mainlogo : "left_mainlogo2"} onClick={this.handleClick}></div>;
              }
            }}
          </MediaQuery>
            <div id="searchbox">
              <MediaQuery query="(min-width: 1250px)">
                {mainlogo === "left_mainlogo" && input}
                {mainlogo === "left_mainlogo2" && input}
              </MediaQuery>
              <MediaQuery query="(max-width: 1249px)">
              {(!this.state.activated) ? (<div className="spacer"><LeftSearchButton sendData={this.getData}/></div>) : input }
              </MediaQuery>
            </div>
            <Cluster sendData={this.getArrayData} logo={mainlogo} window={this.state.WindowSize} active={this.state.activated}/>
          </div>
      );
    }
  }
  
  export default Left;