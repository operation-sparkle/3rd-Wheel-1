import React from 'react';
import Container from 'react-bootstrap/Container';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Toast from 'react-bootstrap/Toast';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import inbound from '../../../test-data/inbound';
import outbound from '../../../test-data/outbound';

const Pending = () => {
  
  function lister(userArray) {
    let i = 0;
    return userArray.map((user) => {
      return (
      <ListGroupItem key={(++i).toString()}>
      <Toast>
        <Toast.Header>
              <img src={user.img} height="300px" width="340" className="avatar" alt="https://previews.123rf.com/images/panyamail/panyamail1809/panyamail180900343/109879063-user-avatar-icon-sign-profile-symbol.jpg" />
          
        </Toast.Header>
        <Toast.Body>
              <h4><strong className={user.name}>{user.name}</strong></h4>
          <p><small>Age: {user.age}</small></p>
          <p><small>Gender: {user.gender}</small></p>
          <p>Some info.</p>
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
              {lister(inbound)}
            </ListGroup>
          </Tab>
          <Tab eventKey="outbound" title="Outbound Requests">
            <ListGroup>
            {lister(outbound)}
            </ListGroup>
          </Tab>
        </Tabs>
      </Container>
    )
}

export default Pending;