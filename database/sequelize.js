const Sequelize = require('sequelize');

const db = new Sequelize('3rd-wheel', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
})

const users = db.define('users', {
    id: Sequelize.NUMBER,
    name: Sequelize.STRING,
    interests: Sequelize.STRING
});

const restaurants = db.define('restaurants', {
    id: Sequelize.NUMBER,
    name: Sequelize.STRING,
    type: Sequelize.STRING,
    location: Sequelize.STRING
});

const entertainment = db.define('entertainment', {
    id: Sequelize.NUMBER,
    name: Sequelize.STRING,
    type: Sequelize.STRING,
    location: Sequelize.STRING
});

const activity = db.define('activity', {
    id: Sequelize.NUMBER,
    name: Sequelize.STRING,
    type: Sequelize.STRING,
    location: Sequelize.STRING
});

const hotSpots = db.define('hotspot', {
    id: Sequelize.NUMBER,
    name: Sequelize.STRING,
    rating: Sequelize.NUMBER,
});

exports.db = db;
exports.users = users;
exports.restaurants = restaurants;
exports.entertainment = entertainment;
exports.activity = activity;
exports.hotSpots = hotSpots;