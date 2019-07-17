const {
  user, date, userInterest, couple, category, spot,
} = require('../sequelize');

module.exports = {
  user: {
    get: () => user.findAll(),

    post: () => {

    },
  },

  date: {
    get: () => {

    },

    post: () => {

    },
  },

  userInterest: {
    get: () => {

    },

    post: () => {

    },
  },

  couple: {
    get: () => {

    },

    post: () => {

    },
  },

  category: {
    get: () => {

    },

    post: () => {

    },
  },

  spot: {
    get: () => {

    },

    post: () => {

    },
  },
};
