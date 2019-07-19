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

const restCategories = () => {
  const options = {
    url: 'https://api.yelp.com/v3/categories',
    Authorization: `Bearer ${config.YELP_KEY}`,
  };
  axios.get(options.url)
    .then((responce) => {
      responce.categories.filter(category => category.parent_aliases === 'restaurants')
        .map(parentAlias => ({
          name: parentAlias.text,
          alias: parentAlias.alias,
        }));
    })
    .catch(err => console.log(`category error: ${err}`));
};

module.exports = {
  getRestaurant,
  restCategories,
};
