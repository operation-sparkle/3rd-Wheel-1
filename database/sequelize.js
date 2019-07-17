const Sequelize = require('sequelize');

const sequelize = new Sequelize('3rd-wheel', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
})

const users = sequelize.define('users', {
    id: Sequelize.NUMBER,
    name: Sequelize.STRING,
    interests: Sequelize.STRING,
    bio: Sequelize.STRING,
    comments: Sequelize.STRING
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

const hotSpots = sequelize.define('hotspot', {
    id: Sequelize.NUMBER,
}, {sequelize, modelName: 'hotspot' });

hotSpots.belongsTo(users, restaurants, entertainment, activity);

exports.sequelize = sequelize;
exports.users = users;
exports.restaurants = restaurants;
exports.entertainment = entertainment;
exports.activity = activity;
exports.hotSpots = hotSpots;