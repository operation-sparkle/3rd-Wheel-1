import React from 'react';
import FriendOption from './FriendOption';

const Friendzone = (props) => {
    const { customers } = props;
    return (
        <div>
            <h2>You are in the Friendzone!</h2>
            <div className="friend-div col-12 row">
                {customers.map((friend, i) => <FriendOption friend={friend} key={i} />)}
            </div>
        </div>
    )
}

export default Friendzone;