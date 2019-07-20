const {
  User, Date, UserInterest, Couple, Category, Spot,
} = require('../sequelize');
const { restCategories, haversineDistance } = require('../helpers/db-helpers.js');

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

UserInterest.prototype.findMatches = async (interests, user) => {
  try {
    const { id: userId, longitude: userLon, latitude: userLat } = user;
    const matchingInterests = await interests.map(({ categoryId }) => {
      return UserInterest.findAll({ categoryId });
    });
    const filteredMatches = matchingInterests.reduce(async (matches, match) => {
      const { userId: matchId, categoryId } = match;
      const { longitude: matchLon, latitude: matchLat } = await User.findOne({ matchId });
      const coupleExists = await Couple.findOne({ where: { user2Id: matchId } });
      if (matchId === userId
        || haversineDistance([userLon, userLat], [matchLon, matchLat]) > 10
        || !coupleExists) {
        return matches;
      }
      if (matches[matchId] === undefined) {
        matches[matchId] = [];
      }
      matches[matchId].push(categoryId);
      return matches;
    }, {});
    return filteredMatches;
  } catch (err) {
    console.error(err);
    return err;
  }
};

module.exports = {
  User,
  Date,
  UserInterest,
  Couple,
  Category,
  Spot,
};
