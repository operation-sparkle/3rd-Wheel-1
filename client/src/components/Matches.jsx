import React, {useState} from 'react';
import Image from 'react-bootstrap/Image';
import Carousel from 'react-bootstrap/Carousel';
import CarouselItem from 'react-bootstrap/CarouselItem'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import CardImg from 'react-bootstrap/CardImg';
import Axios from 'axios';



const Matches = (props) => {
  const [index, changeIndex] = useState(0);
  const {user} = props;

  function handleChange() {
    changeIndex(index++);
    setDirection(index++);
  }
  function test() {
    console.log(props, 'Ok');
  }

  function newMatch(users) {
   return users.map((user) => {
      return (
        <CarouselItem>
          <Card>
            <CardImg width="70%" height="60%" src={ user.image || "https://previews.123rf.com/images/panyamail/panyamail1809/panyamail180900343/109879063-user-avatar-icon-sign-profile-symbol.jpg" } />
            <Card.Title>{user.name || "Error"}</Card.Title>
            <Card.Text>
              <div>Age: {user.age || "Error"}</div>
              <div>Interest: {`${user.interest1, user.interest2, user.interest3}` || "An error has ocurred."}</div>
            </Card.Text>
          </Card>
        </CarouselItem>
      )
    })
  }
  function getNewMatch() {
    console.log('clicked');
    Axios.post(`/matches/userId=${user.id}`)
    .then((user) => {
      console.log(user);
    }).catch((err) => {
      console.error(`There was an error: ${err}`);
    })
  }


  return (
    <div>
    <Carousel controls={false} activeIndex={index} dir="left">
        <CarouselItem>
          <Card>
            <CardImg width="70%" height="60%" src={"https://previews.123rf.com/images/panyamail/panyamail1809/panyamail180900343/109879063-user-avatar-icon-sign-profile-symbol.jpg"} />
            <Card.Title>{"Find a Match"}</Card.Title>
            <Card.Text>
              <div>Age: {"???"}</div>
              <div>Interest: {"???"}</div>
            </Card.Text>
          </Card>
        </CarouselItem>
    </Carousel>
      <Button onClick={test} variant="success" size="lg" block>Accept</Button>
      <Button onClick={getNewMatch} variant="primary" size="lg" block>Skip</Button>
      <Button variant="danger" size="lg" block>Reject</Button>
    </div>

  );
}

export default Matches;