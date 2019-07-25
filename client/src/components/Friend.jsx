import React from 'react';
import Card from 'react-bootstrap/Card';
import CardImg from 'react-bootstrap/CardImg';

const Friend = (props) => {
    const { friend } = props;
return (
    <Card className='friend-cards col-12 col-md-4'>
        <CardImg src={friend.pic} />
        <Card.Title>{friend.name}</Card.Title>
        <Card.Text>Age: {friend.age}</Card.Text>
        <Card.Text>Bio: {friend.bio}</Card.Text>
        <div className="row ghost-button-div col-12">
            <button className="btn col-8 ghost-button">Ghost</button>
        </div>
    </Card>
)
};

export default Friend;