

const {
  User, Date, UserInterest, Couple, Category, Spot,
} = require('../sequelize');

User.get = User.findAll();

module.exports = {
  User,
  Date,
  UserInterest,
  Couple,
  Category,
  Spot,
};
