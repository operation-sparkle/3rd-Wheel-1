import React from 'react';
import Card from 'react-bootstrap/Card';
import CardImg from 'react-bootstrap/CardImg';

const Friend = (props) => {
    const { friend, onGhost } = props;
return (
    <Card className='friend-cards col-12 col-md-4'>
        <CardImg className="friend-pic"  src={friend.pic} />
        <h4>{friend.name}</h4>
        <Card.Text>Age: {friend.age}</Card.Text>
        <Card.Text>Bio: {friend.bio}</Card.Text>
        <div className="row ghost-button-div col-12">
            <button className="btn col-8 ghost-button" id={friend.id} onClick={onGhost}>Ghost</button>
        </div>
    </Card>
)
};

export default Friend;