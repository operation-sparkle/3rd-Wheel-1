import React, { useState, useEffect } from 'react';


import Image from 'react-bootstrap/Image';
import Axios from 'axios';
import Container from 'react-bootstrap/Container';
import Figure from 'react-bootstrap/Figure';
import FigureImage from 'react-bootstrap/FigureImage';



const HotSpots = (props) => {
  const [hotSpots, assignSpots] = useState([])
  let [restaurantType, setType] = useState(null);

  function setRestaurant(input) {
    setType(restaurantType = input.target.value)
    const options = {
      method: 'get',
      url: '/restDecider',
      params: {
        restaurantFilter: restaurantType,
      }
    }
    Axios(options)
      .then((response) => {
        console.log('no error', response)
      })
      .catch((error) => {
        console.log('error'.errror)
      })
  }
  
  useEffect(() => {
    async function fetch () {
      try {
        const result = await Axios.get('/hotspots');
        console.log(result);
        const spots = result.data;
        assignSpots(spots);
      } catch (err) {
        console.error(err);
      }
    }
    fetch();
  }, [])


  return (
    <Container>
      <h1>Restaurant Decider</h1>
        <select onChange={setRestaurant}>
        <option value="burgers">Burgers</option>
        <option value="hotdog">Hot Dogs</option>
        <option value="mexican">Mexican</option>
        <option value="bbq">Barbeque</option>
        <option value="cajun">Cajun</option>
        <option value="french">French</option>
        <option value="kosher">Kosher</option>
        <option value="halal">Halal</option>
        <option value="pizza">Pizza</option>
        <option value="seafood">Seafood</option>
        </select>
      <h4> Hot Spots </h4>
      {
        hotSpots.map(locale => (
          <Figure>

            <Figure.Caption>
              {locale.name}
            </Figure.Caption>

            <Figure.Image 
            width="540px"
            height="400px"
            src={locale.image_url}
            alt="540x400"
            />

            

          </Figure>
        ))
      }
    </Container>
  );
}

export default HotSpots;