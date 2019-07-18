import React from 'react';
import Image from 'react-bootstrap/Image';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Profile = (props) => {

  return (

    <Container>
  <Row>
    <Col xs={6} md={4}>
      <Image src="https://cdn.pixabay.com/photo/2015/08/14/19/42/frog-888798_960_720.jpg" thumbnail />
    </Col>
  </Row>
</Container>


  );
}

export default Profile;