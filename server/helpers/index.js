const axios = require('axios');

const fetchRestaurants = async (categoriesArray, latitude, longitude) => {
  const categories = categoriesArray.join(',');
  const options = {
    method: 'get',
    url: 'https://api.yelp.com/v3/businesses/search',
    headers: {
      'Authorization': `Bearer ${process.env.YELP_KEY}`,
      limit: 5,
      categories,
      latitude,
      longitude,
    },
  };
  const response = await axios(options);
  const { businesses } = response.data;
  return businesses;
};

const selectMatch = (matches) => {
  const orderedMatches = Object.keys(matches).sort((a, b) => {
    return matches[b].length - matches[a].length;
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
  fetchRestaurants,
  selectMatch,
  sanitizeUser,
};
