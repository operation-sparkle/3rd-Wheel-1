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
      response.businesses.map(business => business.ratings);
    })
    .catch(err => console.log(err, 'axios error'));
};
