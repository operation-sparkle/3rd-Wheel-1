import React from 'react';
import Image from 'react-bootstrap/Image'
import Carousel from 'react-bootstrap/Carousel'


const Matches = (obj) => {
  return (
    <div>My Matches
    <Carousel>
      <Carousel.Item>
        <img
        className={obj.name}
        src="https://previews.123rf.com/images/panyamail/panyamail1809/panyamail180900343/109879063-user-avatar-icon-sign-profile-symbol.jpg"
        height="800px"
        width="750px"
        alt="No Image Given"
        />
        <Carousel.Caption>
          <h3>Name</h3>
          <p>Hook</p>
          <p>Interest</p>
          <p>Interest</p>
          <p>Interest</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
    </div>
  );
}

export default Matches;