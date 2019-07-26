import React from 'react';
import FriendOption from './FriendOption';
import Friend from './Friend';

const Friendzone = (props) => {
    const { customers, dumpOption, dumpClick, friendClicked, onSubmit, interests, messages, user, friends, onGhost } = props;
    console.log(friendClicked);
    if(friendClicked === false){
    return (
        <div>
            <h2>You are in the Friendzone!</h2>
            <div className="col-12 row">
            <h4 style={{textAlign: 'center'}}>My Friends:</h4>
                {friends.length > 0 ? friends.map((friend, i) => <Friend friend={friend} key={i} onGhost={onGhost} />) : "Well, this is awkward... It appears you don't have any friends."}
            </div>
            <div className="friend-div col-12 row">
                <h4 style={{ textAlign: 'center' }}>Meet someone new:</h4>
                {customers.map((friend, i) => <FriendOption friend={friend} messages={messages} key={i} interests={interests} user={user}/>)}
            </div>
        </div>
    )} else if(friendClicked === true){
        return (
            <div>
                <div className="message">
                    <h3 className="message-body">{dumpOption}</h3>
                    <div className="row col-12 action-button-div">
                        <button className="btn col-4 action-button" id="4" onClick={dumpClick}>Tame</button>
                        <button className="btn col-4 action-button" id="5" onClick={dumpClick}>Mild</button>
                        <button className="btn col-4 action-button" id="6" onClick={dumpClick}>Rabid</button>
                        <button className="btn col-10 action-button" onClick={onSubmit}>Send</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Friendzone;