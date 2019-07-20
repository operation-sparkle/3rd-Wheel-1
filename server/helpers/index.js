const axios = require('axios');

const getRestaurant = (location, categories) => {
  const options = {
    url: `https://api.yelp.com/v3/businesses/search?location=${location}&categories=${categories}`,
    Authorization: `Bearer ${process.env.YELP_KEY}`,
  };
  axios.get(options.url)
    .then((response) => {
    //   console.log(response);
      response.businesses.filter(business => business.rating >= 4);
    })
    .catch(err => console.log(err, 'axios error'));
};

const selectMatch = (matches) => {
  const orderedMatches = Object.keys(matches).sort((a, b) => {
    return matches[a].length - matches[b].length;
  });
  return orderedMatches[0];
};

const sanitizeUser = (user) => {
  const {
    username, name, pic, age, preference, bio, latitude, longitude, id,
  } = user;
  const sanitizedUser = {
    username, name, pic, age, preference, bio, latitude, longitude, id,
  }
  return sanitizedUser;
}

module.exports = {
  getRestaurant,
  selectMatch,
  sanitizeUser,
};
