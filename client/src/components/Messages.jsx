import React, { useState } from 'react';

class Messages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      intervalOne: null,
      messages: {
        0: ["Yooooooo", "That Was Fun", "Let's Do That Again Soon"],
        1: ["Message", "One"],
        2: ["Message", "Two"],
        3: ["Message", "Three"],
        4: ["Message", "Four"],
        5: ["Message", "Five"],
        6: ["Message", "Six"],
      }
    }
    this.clickMessage = this.clickMessage.bind(this);
  }

clickMessage(event){
    console.log(event.currentTarget)
    document.getElementById(event.currentTarget.id).style.display = "none";
    let arr = ["Hey", "That Food Was Good", "But You Were Stale", "Goodbye Forever"];
    let messageArr = this.state.messages[Number(event.currentTarget.id)];
    let count = 0;
    this.state.intervalOne = setInterval(()=>{
      this.setState({
        message: messageArr[count],
      })
      count++;
      console.log(this.state.message);
      if(count === arr.length){
        clearInterval(this.state.intervalOne);
        this.setState({
          message: "",
        })
      }
    }, 3000)

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
          <div onClick={this.clickMessage} id="1" blah="blah">
            <h3>New Message From User</h3>
            <img className="message-pic" src="https://avatars0.githubusercontent.com/u/24915?s=400&v=4"></img>
      </div>
            <h3 className="message-body">{message}</h3>
            
        </div>
    </div>
    )
  }
};

export default Messages;