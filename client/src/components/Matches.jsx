import React, {useState} from 'react';
import Image from 'react-bootstrap/Image';
import Carousel from 'react-bootstrap/Carousel';
import CarouselItem from 'react-bootstrap/CarouselItem'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import CardImg from 'react-bootstrap/CardImg';
import axios from 'axios';



const Matches = ({ user, customer, customers, datingPool, poolOption, skipMatch, acceptMatch, rejectMatch }) => {
  console.log('datingpool', datingPool);
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
      <Carousel className="match-carousel col-12 col-md-4 mx-auto" controls={false} /* activeIndex={index} */ dir="left">
      {datingPool.length > 0 ? 
        <CarouselItem>
          <Card>
            <CardImg src={poolOption.pic} />
            <Card.Title>{poolOption.username}</Card.Title>
            <Card.Text>Age: {poolOption.age}</Card.Text>
            <Card.Text>Bio: {poolOption.bio}</Card.Text>
          </Card>
        </CarouselItem>
        :
        <CarouselItem>
          <Card>
            <CardImg src="https://media.giphy.com/media/3o6gg3IDiuTKFgGzN6/giphy.gif"/>
            <Card.Text>Sorry, there are no more perspective matches in your area at this time.</Card.Text>
            </Card>
        </CarouselItem>
      }
    </Carousel>
      <Button className="col-10 col-md-4 mx-auto" onClick={acceptMatch} variant="success" size="md" block>Accept</Button>
      <Button className="col-10 col-md-4 mx-auto"  onClick={skipMatch} variant="primary" size="md" block>Skip</Button>
      <Button className="col-10 col-md-4 mx-auto"  onClick={rejectMatch} variant="danger" size="md" block>Reject </Button>
    </div>

  );
}

export default Matches;