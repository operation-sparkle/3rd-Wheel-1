import React from 'react';

const Datezone = (props) => {
    const { interested } = props;
    console.log('datezone props', props);
    return (
        <div>
            <p>You are in the Datezone!</p>
            <p>No current matches</p>
        </div>
    )
}

export default Datezone;