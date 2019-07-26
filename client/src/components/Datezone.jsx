import React from 'react';
import MatchOption from './MatchOption';

const Datezone = (props) => {
    const { interested, interests, onDump, user, onFriendzone } = props;
    console.log('datezone props', props);
    return (
        <div className="datezone-div col-12 mx-auto">
            <h2>You are in the Datezone!</h2>
            <div className="friend-div col-12 row mx-auto">
            {interested.length > 0 ? interested.map((match, i) => <MatchOption match={match} key={i} interests={interests} onDump={onDump} onFriendzone={onFriendzone} user={user} />) : 'No Matches Found'}
            </div>
        </div>
    )
}

export default Datezone;