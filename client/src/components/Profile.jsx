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
        <Card.Img variant="top" src="https://previews.123rf.com/images/panyamail/panyamail1809/panyamail180900343/109879063-user-avatar-icon-sign-profile-symbol.jpg" />
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