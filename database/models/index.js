const {
  User, Date, UserInterest, Couple, Category, Spot,
} = require('../sequelize');
const { restCategories } = require('../helpers/db-helpers.js');

//  Use this function to populate the restaurant sub-categories.
//  This only needs to be done on database init
const populateCategories = async () => {
  try {
    const categoryOptions = {
      name: 'Restaurants',
      alias: 'restaurants',
    };
    const { id: categoryId } = await Category.findOrCreate({ where: categoryOptions });
    const interests = await restCategories();
    interests.forEach((interest) => {
      const interestOptions = {
        name: interest.title,
        alias: interest.alias,
        parentId: categoryId,
      };
      Category.findOrCreate({ where: interestOptions });
    });
  } catch (err) {
    console.error(`Populate Categories failed: ${err}`);
  }
};

//  Feel free to comment this call out after the first run
populateCategories();

module.exports = {
  User,
  Date,
  UserInterest,
  Couple,
  Category,
  Spot,
};
