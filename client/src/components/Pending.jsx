import React from 'react';
import Container from 'react-bootstrap/Container';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Toast from 'react-bootstrap/Toast';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import users from '../../../test-data/customers';

const Pending = () => {
  
  function lister(userArray) {
    let i = 0;
   return userArray.map((user) => {
      return (
      <ListGroupItem key={(++i).toString()}>
      <Toast>
        <Toast.Header>
          <img src={user.img} className="avatar"/>
          <strong className={user.name}>{user.name}</strong>
          <small>Age: {user.age}</small>
          <small>Gender: {user.gender}</small>
        </Toast.Header>
        <Toast.Body>
          Some info.
        </Toast.Body>
      </Toast>
      </ListGroupItem>
      )

    });
  }
    return (
      
      <Container>
        <Tabs defaultActiveKey="inbound" id="pendingDates">
          <Tab eventKey="inbound" title="Incoming Requests">
            <ListGroup>
              {lister(users)}
            </ListGroup>

          </Tab>
        </Tabs>
      </Container>
    )
}

export default Pending;