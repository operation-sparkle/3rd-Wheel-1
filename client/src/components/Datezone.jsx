import React from 'react';
import MatchOption from './MatchOption';

const Datezone = (props) => {
    const { interested } = props;
    console.log('datezone props', props);
    return (
        <div>
            <h2>You are in the Datezone!</h2>
            <div className="friend-div col-12 row">
                {interested.length > 0 ? interested.map((match, i) => <MatchOption match={match} key={i} />) : 'No Matches Found'}
            </div>
        </div>
    )
}

export default Datezone;