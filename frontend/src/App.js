import React, { Component } from 'react';
import './App.css';
import Left from './components/left';
import Right from './components/right';

class App extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    if(nextState.selected !== this.state.selected) {
      return true;
    }
    else if (nextState.bigscreen !== this.state.bigscreen) { 
      return true;
    }
    else {
      return false;
    }
  }
  constructor(props) {
    super(props);
    this.state = {
      selected: [],
      bigscreen: null
    };
    this.getData = this.getData.bind(this);
    this.getBigRes = this.getBigRes.bind(this);
    this.getArrayData = this.getArrayData.bind(this);
  }

  getData(val) {
    this.setState({selected: val});
  }

  getBigRes(val) {
    this.setState({bigscreen: val});
  }

  getArrayData(arr) {
    //console.log(arr);
    this.setState({selected: arr});
  }

  render() {
    return (
      <div id="main">
        <Left sendArrayData={this.getArrayData} sendData={this.getData} sendBigRes={this.getBigRes}/>
        <Right selected={this.state.selected} bigscreen={this.state.bigscreen}/>
      </div>
    );
  }
}
export default App;