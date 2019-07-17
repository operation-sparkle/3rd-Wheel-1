const Sequelize = require('sequelize');

const sequelize = new Sequelize('3rd-wheel', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
})

const users = sequelize.define('users', {
    id: Sequelize.NUMBER,
    name: Sequelize.STRING,
    age: Sequelize.NUMBER,
    interests: Sequelize.STRING,
    bio: Sequelize.STRING,
    comments: Sequelize.STRING,
    location: Sequelize.STRING
}, {sequelize, modelName: 'users' });

const restaurants = sequelize.define('restaurants', {
    id: Sequelize.NUMBER,
    name: Sequelize.STRING,
    type: Sequelize.STRING,
    location: Sequelize.STRING
}, {sequelize, modelName: 'restaurants' });

const entertainment = sequelize.define('entertainment', {
    id: Sequelize.NUMBER,
    name: Sequelize.STRING,
    type: Sequelize.STRING,
    location: Sequelize.STRING
}, {sequelize, modelName: 'entertainment' });

const activity = sequelize.define('activity', {
    id: Sequelize.NUMBER,
    name: Sequelize.STRING,
    type: Sequelize.STRING,
    location: Sequelize.STRING
}, {sequelize, modelName: 'activity' });

const interests = sequelize.define('interests', {
    id: Sequelize.NUMBER,
    firstInterest: Sequelize.STRING,
    secondInterest: Sequelize.STRING,
    thirdInterest: Sequelize.STRING
})

const hotSpots = sequelize.define('hotspot', {
    id: Sequelize.NUMBER,
}, {sequelize, modelName: 'hotspot' });

interests.belongsTo(users);
hotSpots.belongsTo(users, restaurants, entertainment, activity);

exports.sequelize = sequelize;
exports.users = users;
exports.restaurants = restaurants;
exports.entertainment = entertainment;
exports.activity = activity;
exports.interests = interests;
exports.hotSpots = hotSpots;