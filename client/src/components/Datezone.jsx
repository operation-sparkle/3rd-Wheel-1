import React from 'react';
import MatchOption from './MatchOption';

const Datezone = (props) => {
    const {messages, friendClicked, dumpOption, onSubmit, dumpClick, messageClicked, interested, interests, onDump, user, onFriendzone } = props;

    if(friendClicked === true){
        return (
            <div>
                <div className="message">
                    <h3 className="message-body">{dumpOption}</h3>
                    <div className="row col-12 action-button-div">
                        <button className="btn col-4 action-button" id="4" onClick={dumpClick}>Tame</button>
                        <button className="btn col-4 action-button" id="5" onClick={dumpClick}>Mild</button>
                        <button className="btn col-4 action-button" id="6" onClick={dumpClick}>Rabid</button>
                        <button className="btn col-12 action-button" onClick={onSubmit}>Send</button>
                    </div>
                </div>
            </div>
        )
    } else if (messageClicked === true){
        return (
            <div>
                <div className="message">
                    <h3 className="message-body">{dumpOption}</h3>
                    <div className="row col-12 action-button-div">
                    <button className="btn col-4 action-button" id="1" onClick={dumpClick}>Tame</button>
                    <button className="btn col-4 action-button" id="2" onClick={dumpClick}>Mild</button>
                    <button className="btn col-4 action-button" id="3" onClick={dumpClick}>Savage</button>
                    <button className="btn col-12 action-button" onClick={onSubmit}>Send</button>
                    </div>
                </div>
            </div>
        )
    } else if (messageClicked === false) {
        return (
            <div className="datezone-div col-12 mx-auto">
                <h2>You are in the Datezone!</h2>
                <div className="friend-div col-12 row">
                    {interested.length > 0 ? interested.map((match, i) => <MatchOption match={match} key={i} messageClicked={messageClicked} interests={interests} messages={messages} onDump={onDump} onFriendzone={onFriendzone} user={user} />) : <p className="mx-auto">No Matches Found. Check out Find Matches to meet someone!</p>}
                </div>
            </div>
        )
    }
}


export default Datezone;