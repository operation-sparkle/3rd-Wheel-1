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
        0: [<p>Yoooooo</p>, <p>That Was Fun</p>, <p>Let's Do That Again Soon</p>, <p>&#127814;</p>],
        1: [<p className="emoji">&#129340;?</p>],
        2: [<p></p>],
        3: [<p></p>],
        4: [<p></p>],
        5: [<p></p>],
        6: [<p></p>],
      },
      dateMessages: [],
      friendMessages: [],
    }
    this.clickMessage = this.clickMessage.bind(this);
    console.log(this.state.toggleValue);
  }

clickMessage(event){
    console.log(event.currentTarget)
    document.getElementById(event.currentTarget.id).style.display = "none";
  let arr = ["Hey", "That Food Was Good", "But You Were Stale", "Goodbye Forever"];
  let arrTry = [<p>Hey</p>, <p>That Food Was Good</p>, <p>But You Were Stale</p>, <p className="emoji">&#128564;</p>, <p>Goodbye Forever</p>]
    let messageArr = this.state.messages[Number(event.currentTarget.id)];
    let count = 0;
    this.state.intervalOne = setInterval(()=>{
      this.setState({
        message: messageArr[count],
      })
      count++;
      if(count > messageArr.length){
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
            <h3>New Message From Sessa</h3>
            <img className="message-pic" src="https://avatars0.githubusercontent.com/u/24915?s=400&v=4"></img>
      </div>
          <h3 className="message-body">{message}</h3>
        </div>
    </div>
    )
  }
};

export default Messages;