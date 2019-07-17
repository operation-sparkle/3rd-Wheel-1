const Sequelize = require('sequelize');

const sequelize = new Sequelize('3rd-wheel', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

const users = sequelize.define('users', {
  id: Sequelize.NUMBER,
  name: Sequelize.STRING,
  age: Sequelize.NUMBER,
  interests: Sequelize.STRING,
  bio: Sequelize.STRING,
  comments: Sequelize.STRING,
  location: Sequelize.STRING,
  firstInterest: Sequelize.STRING,
  secondInterest: Sequelize.STRING,
  thirdInterest: Sequelize.STRING,
}, { sequelize, modelName: 'users' });

const topInterests = sequelize.define('topInterests', {
  id: Sequelize.NUMBER,
}, { sequelize, modelName: 'topInterests' });

const subCategories = sequelize.define('subCategories', {
  id: Sequelize.NUMBER,
  name: Sequelize.STRING,
  type: Sequelize.STRING,
}, { sequelize, modelName: 'subCategories' });

const couples = sequelize.define('couples', {
  id: Sequelize.NUMBER,
  user1: Sequelize.NUMBER,
  user2: Sequelize.NUMBER,
  datesSpotId: Sequelize.NUMBER,
}, { sequelize, modelName: 'couples' });

const categories = sequelize.define('categories', {
  id: Sequelize.NUMBER,
  name: Sequelize.STRING,
  api: Sequelize.STRING,
}, { sequelize, modelName: 'categories' });

const datespots = sequelize.define('datespots', {
  id: Sequelize.NUMBER,
  usersId: Sequelize.NUMBER,
  subCategoriesId: Sequelize.NUMBER,
  spotName: Sequelize.STRING,
  spotLocation: Sequelize.STRING,
}, { sequelize, modelName: 'datespots' });

users.hasMany(couples, datespots, topInterests);
subCategories.hasMany(datespots, topInterests);
subCategories.belongsTo(categories);
couples.belongsTo(datespots);

exports.sequelize = sequelize;
exports.users = users;
exports.topInterests = topInterests;
exports.subCategories = subCategories;
exports.couples = couples;
exports.categories = categories;
exports.datespots = datespots;
