import React, { useState } from 'react';
import Axios from 'axios';


class Messages extends React.Component {
  constructor(props) {
    super(props);
    let {toggleValue, customers} = props;
    this.state = {
      user: this.props.user,
      message: "",
      intervalOne: null,
      intervalTwo: null,
      elementId: null,
      messages: {
        0: [<p>Yoooooo</p>, <p>That Was Fun</p>, <p>Let's Do That Again Soon</p>, <p>&#128516;</p>],
        1: [<p>Hey There</p>, <p>You Seem Great</p>, <p>But</p>, <p>Let's Just Be Friends</p>, <p className="emoji">&#127752;</p>],
        2: [<p className="emoji">	&#128123;	&#128123;	&#128123;	&#128123;	&#128123;	&#128123;</p>],
        3: [<p className="emoji">&#129340;?</p>],
        4: [<p>Message 4</p>],
        5: [<p>Message 5</p>],
        6: [<p>Hey</p>, <p>BTW</p>, <p>&#129314;YOU NASTY&#129314;</p>],
      },
      dateMessagesState: {
        1: "",
        2: "",
        3: "",
        4: "",
        5: "",
        6: "",
        7: "",
        8: "",
        9: "",  
      }, friendMessagesState: {
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
      friendMessages: [{ sentFrom: "SessaSessaSessa", message: 3 }],
      selectedId: null,
      messageId: null,
      read: [],
    }
    this.retrieveMessages = this.retrieveMessages.bind(this);
    this.clickDateMessage = this.clickDateMessage.bind(this);
    this.intervalDateFunc = this.intervalDateFunc.bind(this);
    this.clickFriendMessage = this.clickFriendMessage.bind(this);
    this.intervalFriendFunc = this.intervalFriendFunc.bind(this);
    this.count = 0;
  }

intervalDateFunc(){
  let messageArr = this.state.messages[this.state.messageId];
  let stateObj = this.state.dateMessagesState;
  stateObj[this.state.selectedId] = messageArr[this.count];
  // let messageState = this.state.messagesState;
 
  this.setState({
    dateMessagesState: stateObj,
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
  }
}

  intervalFriendFunc() {
    let messageArr = this.state.messages[this.state.messageId];
    let stateObj = this.state.friendMessagesState;
    stateObj[this.state.selectedId] = messageArr[this.count];
    // let messageState = this.state.messagesState;

    this.setState({
      friendMessagesState: stateObj,
    })

    this.count++;
    if (this.count > messageArr.length) {
      clearInterval(this.state.intervalTwo);
      this.count = 0;
      this.state.read.push((this.state.dateMessages[this.state.selectedId]));
      // let newArr = this.state.dateMessages.splice(this.state.selectedId - 1, 1);
      // this.setState({
      //   dateMessages: newArr,
      // })
      let element = this.state.element + 1;
      document.getElementById(element).style.display = "none";
    }
  }

componentWillMount(){
  this.retrieveMessages();
}

clickDateMessage(event){
  this.setState({
    elementId: event.currentTarget.id,
    selectedId: event.currentTarget.id[0],
    messageId: event.currentTarget.id[1],
  })
    document.getElementById(event.currentTarget.id).style.display = "none";
    let count = 0;
      this.state.intervalOne = setInterval(this.intervalDateFunc, 3000);
}

clickFriendMessage(event){
  this.setState({
    elementId: event.currentTarget.id,
    selectedId: event.currentTarget.id[0],
    messageId: event.currentTarget.id[1],
  })
    document.getElementById(event.currentTarget.id).style.display = "none";
    let count = 0;
      this.state.intervalTwo = setInterval(this.intervalFriendFunc, 3000);
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
      {this.state.friendMessages.map((friend, i) => {
        let idVal = `${i}${friend.message}`;
        let idVal2 = idVal+1;
        return (<div className="message" id={idVal2}>
          <div onClick={this.clickFriendMessage} id={idVal} key={idVal} >
            <h3>New Message From {friend.sentFrom}</h3>
            {this.props.customers.map((customer) => { if (customer.username === friend.sentFrom) { return <img className="message-pic" src={`${customer.pic}`}></img> } })}
          </div>
          <h3 className="message-body">{this.state.friendMessagesState[i]}</h3>
        </div>)
      })}
    </div>
          : <div>
            {this.state.dateMessages.map((date, j) => {
              let idVal = `${j}${date.message}`
              return (<div className="message">
                <div onClick={this.clickDateMessage} id={idVal} key={idVal} >
                  <h3>New Message From {date.sentFrom}</h3>
                  {this.props.customers.map((customer) => { if (customer.username === date.sentFrom) { return <img className="message-pic" src={`${customer.pic}`}></img> } })}
                </div>
                <h3 className="message-body">{this.state.dateMessagesState[j]}</h3>
              </div>)
            })}
          </div>}
    </div>
    )
  }
};


export default Messages;