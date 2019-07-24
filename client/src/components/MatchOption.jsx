import React from 'react';
import Card from 'react-bootstrap/Card';
import CardImg from 'react-bootstrap/CardImg';

const MatchOption = (props) => {
    const { match } = props;
    return (
        <Card className='friend-cards col-12 col-md-4'>
            <CardImg src={match.pic} />
            <Card.Title>{match.name}</Card.Title>
            <Card.Text>Age: {match.age}</Card.Text>
            <Card.Text>Bio: {match.bio}</Card.Text>
        </Card>
    )
}

export default MatchOption;