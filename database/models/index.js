const {
  User, Date, UserInterest, Couple, Category, Spot,
} = require('../sequelize');
const {
  restCategories, fetchRestaurant, haversineDistance, topInterest,
} = require('../helpers/db-helpers.js');

//  Use this function to populate the restaurant sub-categories.
//  This only needs to be done on database init
const populateCategories = async () => {
  try {
    const categoryOptions = {
      name: 'Restaurants',
      alias: 'restaurants',
    };
    // const options = {
    //   name: 'movie',
    //   alias: 'movie',
    // };
    const categoryArray = await Category.findOrCreate({ where: categoryOptions });   
    // const re = await Category.findOrCreate({ where: options });

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

User.prototype.validPassword = async (password) => {
  try {
    return bcrypt.compare(password, this.password);
  } catch (err) {
    return console.error(err);
  }
};

User.prototype.findMatches = async (interests, user) => {
  try {
    const {
      id: userId, longitude: userLon, latitude: userLat, gender: userGen, preference: userPref,
    } = user;
    const matchingInterests = await interests.map((categoryId) => {
      return UserInterest.findAll({ categoryId });
    });
    const filteredMatches = matchingInterests.reduce(async (matches, match) => {
      const { userId: matchId, categoryId } = match;
      const {
        longitude: matchLon, latitude: matchLat, gender: matchGen, preference: matchPref,
      } = await User.findOne({ matchId });
      const coupleExists = await Couple.findOne({ where: { user2Id: matchId } });
      if (matchId === userId
        || !!coupleExists
        || haversineDistance([userLon, userLat], [matchLon, matchLat]) > 10
        || userPref !== matchGen
        || matchPref !== userGen) {
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

Couple.prototype.findSpot = async (couple) => {
  try {
    const { user1Id, user2Id } = couple;
    const interestsRows = await UserInterest.findAll({
      where: {
        userId: {
          [Op.or]: [user1Id, user2Id],
        },
      },
    });
    const matchedInterestId = topInterest(interestsRows);
    const matchedInterest = await Category.findByPk(matchedInterestId);
    const { longitude, latitude } = await User.findByPk(user1Id);
    const newSpot = fetchRestaurant(matchedInterest, longitude, latitude);
    return newSpot;
  } catch (err) {
    console.error(`Failed to find new match: ${err}`);
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
