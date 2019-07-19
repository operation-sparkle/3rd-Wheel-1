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

module.exports = {
  restCategories,
};
