import React, {useState} from 'react';
import Image from 'react-bootstrap/Image';
import Carousel from 'react-bootstrap/Carousel';
import CarouselItem from 'react-bootstrap/CarouselItem'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import CardImg from 'react-bootstrap/CardImg';
import axios from 'axios';



const Matches = ({ user, customer, customers, skipMatch, acceptMatch, rejectMatch }) => {
  // const [index, changeIndex] = useState(0);
  // const [coupleId, newCouple] = useState(null);

 
 
  // console.log(customer.interest1);
  // function handleChange() {
  //   changeIndex(index++);
  //   setDirection(index++);
  // }

  function accept() {
    axios.post('/matches', { userId: user.id })
      .then(couple => {
        console.log(couple);
        return axios.patch('/matches', {
          status: "accepted",
          coupleId: couple.id,
        })       
      }).then(() => {
        console.log('Accepted');
      }).catch((err) => {
        console.error(`Error while accepting: ${err}`);
      });
  }

  function reject() {
    axios.post('/matches', { userId: user.id })
      .then(couple => {
        console.log(couple);
        return axios.patch('/matches', {
          status: "rejected",
          coupleId: couple.id,
        })
      }).then(() => {
        console.log('Rejected');
      }).catch((err) => {
        console.error(`Error while rejecting: ${err}`);
      });
  }

  function newMatch(users) {
   return users.map((user) => {
      return (
        <CarouselItem>
          <Card>
            <CardImg width="70%" height="60%" src={ user.image || "https://previews.123rf.com/images/panyamail/panyamail1809/panyamail180900343/109879063-user-avatar-icon-sign-profile-symbol.jpg" } />
            <Card.Title>{user.name || "Error"}</Card.Title>
            <Card.Text> Age: {user.age || "Error"}</Card.Text>
            <Card.Text> Interest: {`${user.interest1, user.interest2, user.interest3}` || "An error has ocurred."}</Card.Text>
          </Card>
        </CarouselItem>
      )
    })
  }
  function getNewMatch() {
    console.log('clicked');
    axios.post(`/matches`)
    .then((user) => {
      newCouple(user.coupleId);
      newMatch([user]);
      console.log(user);
    }).catch((err) => {
      console.error(`There was an error: ${err}`);
    })
  }

  // getNewMatch();

  return (
    
    <div>
    <Carousel controls={false} /* activeIndex={index} */ dir="left">
        <CarouselItem>
          <Card>
            <CardImg src={customer.pic} />
            <Card.Title>{customer.username}</Card.Title>
            <Card.Text>Age: {customer.age}</Card.Text>
            <Card.Text>Bio: {customer.bio}</Card.Text>
          </Card>
        </CarouselItem>
    </Carousel>
      <Button onClick={acceptMatch} variant="success" size="lg" block>Accept</Button>
      <Button onClick={skipMatch} variant="primary" size="lg" block>Skip</Button>
      <Button onClick={rejectMatch} variant="danger" size="lg" block>Reject </Button>
    </div>

  );
}

export default Matches;