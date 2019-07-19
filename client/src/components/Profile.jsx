import React, { useState } from 'react';

import Image from 'react-bootstrap/Image';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';


const Profile = (props) => {

  return (
    <div>
    <Card style={{ width: '24rem' }}>
      <Card.Img variant="top" src="https://im.indiatimes.in/content/itimes/photo/2016/Oct/5/1475667154-funniest-baby-jokes-ever.jpg" />
      <Card.Body>
        <Card.Title>My Name</Card.Title>
      </Card.Body>
        <ListGroup className="list-group-first">
          <ListGroupItem>My Age</ListGroupItem>
          <ListGroupItem>My Gender</ListGroupItem>
          <ListGroupItem>My Preference</ListGroupItem>
        </ListGroup>
      <Card.Body>
        <Card.Text>
          Here's a small summary of myself.
        </Card.Text>
      </Card.Body>
      </Card>

      <Container>
        <span>Give me some text or something.</span>
      </Container>

      </div>

  );
}

export default Profile;