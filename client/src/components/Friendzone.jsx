import React from 'react';
import FriendOption from './FriendOption';
import Friend from './Friend';

const Friendzone = (props) => {
    const { customers, interests, messages, user, friends, onGhost } = props;
   
    return (
        <div className="datezone-div col-12 mx-auto">
            <h2>You are in the Friendzone!</h2>
            <div style={{textAlign: 'center'}} className="col-12 row mx-auto">
            <h4 className="section-heading col-12" >My Friends:</h4>
                {friends.length > 0 ? friends.map((friend, i) => <Friend friend={friend} key={i} onGhost={onGhost} />) : <p className="mx-auto" style={{textAlign: 'center'}}>Well, this is awkward... It appears you don't have any friends yet.</p>}
            </div>
            <div className="friend-div col-12 row">
                <h4 className="section-heading col-12" >Meet someone new:</h4>
            {customers.map((friend, i) => <FriendOption friend={friend} messages={messages} key={i} interests={interests} user={user}/>)}
            </div>
        </div>
    )
}

export default Friendzone;