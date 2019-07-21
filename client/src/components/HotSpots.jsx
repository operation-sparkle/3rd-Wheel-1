import React, {useState} from 'react';


import Image from 'react-bootstrap/Image';
import Axios from 'axios';
import Container from 'react-bootstrap/Container';
import Figure from 'react-bootstrap/Figure';
import FigureImage from 'react-bootstrap/FigureImage';



const HotSpots = (props) => {

  function getLocation() {
    Axios.get(`/hotspots/userId=${props.userId}`)
    .then((locations) => {
      locations.map((locale) => {
        console.log(locale.data);
      })
    }).catch((err) => {
      console.error(err);
    })

    return (
      <Container>
        <Figure>

          <Figure.Image 
          width="540px"
          height="400px"
          src={props.image}
          alt="540x400"
          />

          <Figure.Caption>
            {props.info}
          </Figure.Caption>

        </Figure>
      </Container>
    )

  }






  return (
    <Container>
      <h4 onClick={getLocation}>Get some stuff</h4>
    </Container>
    
  );
}

export default HotSpots;