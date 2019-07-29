import React, {useState} from 'react';

import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';


const Profile = ({ user }) => {
  //  const [user, changeUser] = useState(props.user)
 
  return (
    <div>
    <Card style={{ width: '300px' }}>
        <Card.Img variant="top" src={`${user.pic}`} />
      <Card.Body>
        <Card.Title>{user.name || "My Name"}</Card.Title>
      </Card.Body>
        <ListGroup className="list-group-first">
          <ListGroupItem>{user.age || "My Age"}</ListGroupItem>
          <ListGroupItem>{user.gender || "My Gender"}</ListGroupItem>
          <ListGroupItem>{user.preference || "My Preference"}</ListGroupItem>
        </ListGroup>
      <Card.Body>
        <Card.Text>
          {user.bio || "Here's a small summary of myself."}
        </Card.Text>
      </Card.Body>
      </Card>

      <Container>
        <span></span>
      </Container>

      </div>

  );
}

export default Profile;