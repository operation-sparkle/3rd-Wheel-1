const axios = require('axios');

const restCategories = () => {
  const options = {
    method: 'get',
    url: 'https://api.yelp.com/v3/categories',
    headers: { 'Authorization': `Bearer ${process.env.YELP_KEY}` },
  };
  return axios(options)
    .then((response) => {
      const { categories } = response.data;
      const filteredCategories = categories.filter((category) => {
        return category.parent_aliases.includes('restaurants');
      });
      return filteredCategories.map(parentAlias => ({
        name: parentAlias.title,
        alias: parentAlias.alias,
      }));
    })
    .catch((err) => {
      console.error(`category error: ${err}`);
    });
};

const fetchRestraurant = async (category, latitude, longitude) {
  const { alias } = category;
  const options = {
    method: 'get',
    url: 'https://api.yelp.com/v3/businesses/search',
    headers: {
      'Authorization': `Bearer ${process.env.YELP_KEY}` 
      latitude,
      longitude,
      alias,
    }
  }
  const response = await axios(options);
  const { businesses } = response.data;
  return businesses[0];
}

//  This function will find the distance between two coordinates
//  It expects arrays of [longitude, latitude]
const haversineDistance = (coords1, coords2) => {
  const toRadians = x => x * Math.PI / 180;

  const [lon1, lat1] = coords1;
  const [lon2, lat2] = coords2;

  const R = 6371;

  const x1 = lat2 - lat1;
  const x2 = lon2 - lon1;
  const dLat = toRadians(x1);
  const dLon = toRadians(x2);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
    + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2))
    * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};

const topInterest = (interests) => {
  const orderedInterests = interests
    .map(interest => interest.categoryId)
    .reduce((interestSums, interest) => {
      if (interestSums[interest] === undefined) {
        interestSums[interest] = 0;
      }
      interestSums[interest]++;
      return interestSums;
    }, {});
  const topInterest = Object.keys(orderedInterests)
    .sort((a, b) => {
      return orderedInterests[b] - orderedInterests[a];
    })[0];
  return topInterest;
};

module.exports = {
  restCategories,
  fetchRestraurant,
  haversineDistance,
  topInterest,
};
