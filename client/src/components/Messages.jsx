import React, { useState } from 'react';
import { Redirect } from 'react-router-dom'
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import CardImg from 'react-bootstrap/CardImg';
import Button from 'react-bootstrap/Button';

class Messages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message:'Blah',
      intervalOne: null,
    }
    this.clickMessage = this.clickMessage.bind(this);
  }

clickMessage(){
    console.log("clicked", this.state.message)
    let arr = ["Hey", "That Food Was Good", "But You Were Stale", "Goodbye Forever"];
    let count = 0;
    this.state.intervalOne = setInterval(()=>{
      this.setState({
        message: arr[count],
      })
      count++;
      console.log(this.state.message);
      if(count >= arr.length){
        count = 0;
        this.state.intervalOne.clearInterval();
      }
    }, 4000)

}
  
  render(){
    let {message} = this.state;
  // let baseMessage =  (<div>
  //   <h3>New Message From User</h3>
  //   <img className="message-pic" src="https://avatars0.githubusercontent.com/u/24915?s=400&v=4"></img>
  // </div>)

    return (
    <div>
      <div className="message">
          <div onClick={this.clickMessage}>
            <h3>New Message From User</h3>
            <h3>{message}</h3>
            <img className="message-pic" src="https://avatars0.githubusercontent.com/u/24915?s=400&v=4"></img>
          </div>
        </div>
    </div>
    )
  }
};

export default Messages;