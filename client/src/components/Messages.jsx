import React, { useState } from 'react';

class Messages extends React.Component {
  constructor(props) {
    super(props);
    let {toggleValue} = props;
    this.state = {
      message: "",
      intervalOne: null,
      toggleValue,
      messages: {
        0: [<p>Yoooooo</p>, <p>That Was Fun</p>, <p>Let's Do That Again Soon</p>, <p>&#128516;</p>],
        1: ["Hey There", <p>You Seem Great</p>, <p>But</p>, <p>Let's Just Be Friends</p>, <p className="emoji">&#127752;</p>],
        2: [<p></p>],
        3: [<p className="emoji">&#129340;?</p>],
        4: [<p></p>],
        5: [<p></p>],
        6: [<p>Hey</p>, <p>BTW</p>, <p>&#129314;YOU NASTY&#129314;</p>],
      },
      messagesState: {
        1: "",
        2: "",
        3: "",
        4: "",
        5: "",
        6: "",
        7: "",
        8: "",
        9: "",  
      },
      dateMessages: [{sentFrom: "BennyBrosh", message: 1}, {sentFrom: "SessaSessaSessa", message: 2}, {sentFrom: "jone388"}],
      friendMessages: [],
      selectedId: null,
      messageId: null,
      read: [],
    }
    this.clickMessage = this.clickMessage.bind(this);
    this.intervalFunc = this.intervalFunc.bind(this);
    console.log(this.state.toggleValue);
    this.count = 0;
  }

intervalFunc(){
  let messageArr = this.state.messages[this.state.messageId];
  let stateObj = this.state.messagesState;
  stateObj[this.state.selectedId] = messageArr[this.count];
  // let messageState = this.state.messagesState;
  console.log(stateObj);
  this.setState({
    messagesState: stateObj,
  })
    
    this.count++;
    if (this.count > messageArr.length) {
      clearInterval(this.state.intervalOne);
      this.setState({
        message: "",
      })
      this.count = 0;
      this.state.read.push((this.state.dateMessages[this.state.selectedId]));
      let newArr = this.state.dateMessages.splice(this.state.selectedId - 1, 1);
      this.setState({
        dateMessages: newArr,
      })
    }
}

clickMessage(event){
  this.setState({
    selectedId: event.currentTarget.id[0],
    messageId: event.currentTarget.id[1],
  })
  //  let elementIndex = event.currentTarget.id[0];
  //  let messageId = event.currentTarget.id[1];
    document.getElementById(event.currentTarget.id).style.display = "none";
  // let arr = ["Hey", "That Food Was Good", "But You Were Stale", "Goodbye Forever"];
  // let arrTry = [<p>Hey</p>, <p>That Food Was Good</p>, <p>But You Were Stale</p>, <p className="emoji">&#128564;</p>, <p>Goodbye Forever</p>]
    // let messageArr = this.state.messages[messageId];
    let count = 0;
    // let message = messageArr[count];
  
  //   this.state.intervalOne = setInterval(function(){
  //     this.state.messagesState[elementIndex] = messageArr[count];
  //     let messageState = this.state.messagesState;
  //     this.setState({
  //       messagesState: messageState,
  //     })
  //     debugger; 
  //     count++; //  let elementIndex = event.currentTarget.id[0];
  // //  let messageId = event.currentTarget.id[1];
  //     if(count > messageArr.length){
  //       clearInterval(this.state.intervalOne);
  //       this.setState({
  //         message: "",
  //       })
  //     }
  //   }, 3000)
      this.state.intervalOne = setInterval(this.intervalFunc, 3000);
}
  
  render(){
    let {message} = this.state;
  
    return (
    <div>
      <div className="message">
          <div onClick={this.clickMessage} id="6" blah="blah">
            <h3>New Message From Sessa</h3>
            <img className="message-pic" src="https://avatars0.githubusercontent.com/u/24915?s=400&v=4"></img>
      </div>
          <h3 className="message-body">{message}</h3>
        </div>
      {this.state.dateMessages.map((date, i) => {
       
        // this.state.messagesState[i] = "";
        let idVal = `${i}${date.message}`
        console.log(this.state.messagesState);
        return (<div className="message">
          <div onClick={this.clickMessage} id={idVal} key={i} >
            <h3>New Message From {date.sentFrom}</h3>
            <img className="message-pic" src="https://avatars0.githubusercontent.com/u/24915?s=400&v=4"></img>
          </div>
          <h3 className="message-body">{this.state.messagesState[i]}</h3>
        </div>)
      })}
    </div>
    )
  }
};

export default Messages;