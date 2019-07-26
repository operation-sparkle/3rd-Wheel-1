import React, { useState } from 'react';
import Axios from 'axios';


class Messages extends React.Component {
  constructor(props) {
    super(props);
    //let {toggleValue} = props;
    this.state = {
      user: this.props.user,
      message: "",
      intervalOne: null,
      elementId: null,
      messages: {
        0: [<p>Yoooooo</p>, <p>That Was Fun</p>, <p>Let's Do That Again Soon</p>, <p>&#128516;</p>],
        1: [<p>Hey There</p>, <p>You Seem Great</p>, <p>But</p>, <p>Let's Just Be Friends</p>, <p className="emoji">&#127752;</p>],
        2: [<p>Message 2</p>],
        3: [<p className="emoji">&#129340;?</p>],
        4: [<p>Message 4</p>],
        5: [<p>Message 5</p>],
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
      dateMessages: [{sentFrom: "BennyBrosh", message: 1}, {sentFrom: "SessaSessaSessa", message: 2}, {sentFrom: "jone388", message: 3}],
      friendMessages: [{ sentFrom: "SessaSessaSessa", message: 2 }],
      selectedId: null,
      messageId: null,
      read: [],
    }
    this.retrieveMessages = this.retrieveMessages.bind(this);
    this.clickMessage = this.clickMessage.bind(this);
    this.intervalFunc = this.intervalFunc.bind(this);
    this.count = 0;
  }

intervalFunc(){
  let messageArr = this.state.messages[this.state.messageId];
  let stateObj = this.state.messagesState;
  stateObj[this.state.selectedId] = messageArr[this.count];
  // let messageState = this.state.messagesState;
 
  this.setState({
    messagesState: stateObj,
  })
    
    this.count++;
    if (this.count > messageArr.length) {
      clearInterval(this.state.intervalOne);
      this.count = 0;
      this.state.read.push((this.state.dateMessages[this.state.selectedId]));
      // let newArr = this.state.dateMessages.splice(this.state.selectedId - 1, 1);
      // this.setState({
      //   dateMessages: newArr,
      // })
      let element = this.state.element + 1;
      document.getElementById(element).style.display = "none";
      debugger;
  }
}

componentWillMount(){
  this.retrieveMessages();
}

clickMessage(event){
  this.setState({
    elementId: event.currentTarget.id,
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

  retrieveMessages(){
    const options = {
      method: 'get',
      url: '/sendMessage',
      params: {
        userId: this.state.user.id,
      }
    }
    Axios(options)
      .then((response) => {
        console.log('no error', response)
      })
      .catch((error) => {
        console.log('error', error)
      })
    }


  
  
  render(){
  
    return (
      <div>
        {this.props.toggleVal ?
    <div>
      {this.state.friendMessages.map((date, i) => {
        let idVal = `${i}${date.message}`;
        let idVal2 = idVal+1;
        return (<div className="message" id={idVal2}>
          <div onClick={this.clickMessage} id={idVal} key={i} >
            <h3>New Message From {date.sentFrom}</h3>
            <img className="message-pic" src="https://avatars0.githubusercontent.com/u/24915?s=400&v=4"></img>
          </div>
          <h3 className="message-body">{this.state.messagesState[i]}</h3>
        </div>)
      })}
    </div>
          : <div>
            {this.state.dateMessages.map((date, i) => {
              let idVal = `${i}${date.message}`
              return (<div className="message">
                <div onClick={this.clickMessage} id={idVal} key={i} >
                  <h3>New Message From {date.sentFrom}</h3>
                  <img className="message-pic" src="https://avatars0.githubusercontent.com/u/24915?s=400&v=4"></img>
                </div>
                <h3 className="message-body">{this.state.messagesState[i]}</h3>
              </div>)
            })}
          </div>}
    </div>
    )
  }
};

export default Messages;