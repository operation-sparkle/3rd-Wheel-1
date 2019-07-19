const axios = require('axios');

const restCategories = () => {
  const options = {
    url: 'https://api.yelp.com/v3/categories',
    Authorization: `Bearer ${process.env.YELP_KEY}`,
  };
  return axios.get(options.url)
    .then((responce) => {
      return responce.categories.filter(category => category.parent_aliases === 'restaurants')
        .map(parentAlias => ({
          name: parentAlias.text,
          alias: parentAlias.alias,
        }));
    })
    .catch(err => console.error(`category error: ${err}`));
};

module.exports = {
  restCategories,
};
