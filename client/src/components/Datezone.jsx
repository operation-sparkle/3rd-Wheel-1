import React from 'react';

const Datezone = (props) => {
    const { interested } = props;
    console.log('datezone props', props);
    return (
        <div>
            <h2>You are in the Datezone!</h2>
            <p>No current matches</p>
        </div>
    )
}

export default Datezone;