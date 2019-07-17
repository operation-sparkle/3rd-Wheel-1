const Sequelize = require('sequelize');

const sequelize = new Sequelize('3rd-wheel', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

const user = sequelize.define('user', {
  id: Sequelize.NUMBER,
  name: Sequelize.STRING,
  pic: Sequelize.STRING,
  password: Sequelize.STRING,
  salt: Sequelize.STRING,
  age: Sequelize.NUMBER,
  interests: Sequelize.STRING,
  bio: Sequelize.STRING,
  latitude: Sequelize.NUMBER,
  longitude: Sequelize.NUMBER,
}, { sequelize, modelName: 'user' });

const date = sequelize.define('date', {
  id: Sequelize.NUMBER,
}, { sequelize, modelName: 'date' });

const userInterest = sequelize.define('userInterest', {
  id: Sequelize.NUMBER,
}, { sequelize, modelName: 'userInterest' });

const couple = sequelize.define('couple', {
  id: Sequelize.NUMBER,
}, { sequelize, modelName: 'couple' });

const category = sequelize.define('category', {
  id: Sequelize.NUMBER,
  name: Sequelize.STRING,
}, { sequelize, modelName: 'category' });

const spot = sequelize.define('spot', {
  id: Sequelize.NUMBER,
  name: Sequelize.STRING,
  latitude: Sequelize.NUMBER,
  longitude: Sequelize.NUMBER,
}, { sequelize, modelName: 'spot' });

category.belongsTo(category, { as: 'children', foreignKey: 'parentId', useJunctionTable: false });
date.belongsTo(spot);
date.belongsTo(couple);
userInterest.belongsTo(category);
userInterest.belongsTo(user);
couple.belongsTo(user, { as: 'user1Id' });
couple.belongsTo(user, { as: 'user2Id' });

exports.sequelize = sequelize;
exports.user = user;
exports.date = date;
exports.userInterest = userInterest;
exports.couple = couple;
exports.category = category;
exports.spot = spot;
