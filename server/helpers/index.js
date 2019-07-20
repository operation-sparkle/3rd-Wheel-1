const axios = require('axios');
const config = require('../../api-config');


const getRestaurant = (location, categories) => {
  const options = {
    url: `https://api.yelp.com/v3/businesses/search?location=${location}&categories=${categories}`,
    Authorization: `Bearer ${config.YELP_KEY}`,
  };
  axios.get(options.url)
    .then((response) => {
    //   console.log(response);
      response.businesses.filter(business => business.rating >= 4);
    })
    .catch(err => console.log(err, 'axios error'));
};

//  This function will find the distance between two coordinates
//  It expects arrays of [longitude, latitude]
const haversineDistance = (coords1, coords2) => {
  const toRadians = (x) => {
    return x * Math.PI / 180;
  };

  const [lon1, lat1] = coords1;
  const [lon2, lat2] = coords2;

  const R = 6371;

  const x1 = lat2 - lat1;
  const x2 = lon2 - lon1;
  const dLat = toRadians(x1);
  const dLon = toRadians(x2);

  const a = Math.sin(dlat / 2) * Math.sin(dlat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};

module.exports = {
  getRestaurant,
  haversineDistance,
};
