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
    const categoryArray = await Category.findOrCreate({ where: categoryOptions });
    const { id: categoryId } = categoryArray[0];
    const interests = await restCategories();
    interests.forEach((interest) => {
      const interestOptions = {
        name: interest.name,
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
// populateCategories();

UserInterest.prototype.findMatches = async (interests) => {
  const matchingInterests = await interests.map(({categoryId}) => {
    return UserInterest.findAll({ categoryId });
  });
};

module.exports = {
  User,
  Date,
  UserInterest,
  Couple,
  Category,
  Spot,
};
