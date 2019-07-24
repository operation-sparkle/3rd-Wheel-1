import React from 'react';
import Card from 'react-bootstrap/Card';
import CardImg from 'react-bootstrap/CardImg';

const FriendOption = (props) => {
    const { friend } = props;
    return (
        <Card className='friend-cards col-12 col-md-4'>
            <CardImg src={friend.pic} />
            <Card.Title>{friend.name}</Card.Title>
            <Card.Text>Age: {friend.age}</Card.Text>
            <Card.Text>Bio: {friend.bio}</Card.Text>
        </Card>
    )
}

export default FriendOption;