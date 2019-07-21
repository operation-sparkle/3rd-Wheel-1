const axios = require('axios');

const fetchRestaurants = async (categoriesArray, latitude, longitude) => {
  try {
    const categories = categoriesArray.join(',');
    const options = {
      method: 'get',
      url: 'https://api.yelp.com/v3/businesses/search',
      headers: {
        'Authorization': `Bearer ${process.env.YELP_KEY}`,
      },
      params: {
        limit: '5',
        categories,
        latitude: latitude.toString(),
        longitude: longitude.toString(),
      },
    };
    const response = await axios(options);
    const { businesses } = response.data;
    return businesses;
  } catch (err) {
    console.error(`Failed to fetch from Yelp: ${err}`);
    return err;
  }
};

const fetchSpot = async (apiId) => {
  try {
    const options = {
      method: 'get',
      url: `https://api.yelp.com/v3/businesses/${apiId}`,
      headers: {
        'Authorization': `Bearer ${process.env.YELP_KEY}`,
      },
    };
    const response = await axios(options);
    const { business } = response.data;
    return business;
  } catch (err) {
    console.error(`Failed to fetch spot: ${err}`);
    return err;
  }
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
  };
  return sanitizedUser;
};

module.exports = {
  fetchRestaurants,
  fetchSpot,
  selectMatch,
  sanitizeUser,
};
