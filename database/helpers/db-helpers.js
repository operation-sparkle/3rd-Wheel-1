const axios = require('axios');

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
  restCategories,
};
