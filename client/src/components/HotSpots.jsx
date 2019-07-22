import React, { useState, useEffect } from 'react';


import Image from 'react-bootstrap/Image';
import Axios from 'axios';
import Container from 'react-bootstrap/Container';
import Figure from 'react-bootstrap/Figure';
import FigureImage from 'react-bootstrap/FigureImage';



const HotSpots = (props) => {
  const [ hotSpots, assignSpots ] = useState([])
  
  useEffect(() => {
    async function fetch () {
      const spots = await Axios.get('/hotspots');
      try {
        assignSpots(spots);
      } catch (err) {
        console.error(err);
      }
    }
    fetch();
  }, [])


  return (
    <Container>
      <h4> Hot Spots </h4>
      {
        hotSpots.map(locale => (
          <Figure>

            <Figure.Image 
            width="540px"
            height="400px"
            src={locale.image_url}
            alt="540x400"
            />

            <Figure.Caption>
              {locale.info}
            </Figure.Caption>

          </Figure>
        ))
      }
    </Container>
  );
}

export default HotSpots;