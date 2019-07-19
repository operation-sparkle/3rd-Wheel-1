// const mysql = require('mysql');
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');


const sequelize = new Sequelize('3rd_wheel', 'root', '', {
//   host: 'localhost',
  dialect: 'mysql',
});

const User = sequelize.define('user', {
  username: {
    type: Sequelize.STRING,
    unique: true,
  },
  name: Sequelize.STRING,
  pic: Sequelize.STRING,
  password: Sequelize.STRING,
  age: Sequelize.INTEGER,
  interests: Sequelize.STRING,
  preference: Sequelize.STRING,
  bio: Sequelize.STRING,
  latitude: Sequelize.INTEGER,
  longitude: Sequelize.INTEGER,

}, {
  hooks: {
    beforeCreate: (user) => {
      const salt = bcrypt.genSaltSync(10);
      user.password = bcrypt.hashSync(user.password, salt);
    },
  },
  sequelize,
  modelName: 'user',
});

User.prototype.validPassword = async function (password) {
  try {
    return bcrypt.compare(password, this.password);
  } catch (err) {
    return console.error(err);
  }
};

const Date = sequelize.define('date', {
}, { sequelize, modelName: 'date' });

const UserInterest = sequelize.define('userInterest', {
}, { sequelize, modelName: 'userInterest' });

const Couple = sequelize.define('couple', {
  status: Sequelize.STRING,
}, { sequelize, modelName: 'couple' });

const Category = sequelize.define('category', {
  name: Sequelize.STRING,
  alias: Sequelize.STRING,
}, { sequelize, modelName: 'category' });

const Spot = sequelize.define('spot', {
  apiId: Sequelize.STRING,
  weigth: Sequelize.INTEGER,
}, { sequelize, modelName: 'spot' });

Category.belongsTo(Category, { as: 'children', foreignKey: 'parentId', useJunctionTable: false });
Date.belongsTo(Spot);
Date.belongsTo(Couple);
UserInterest.belongsTo(Category);
UserInterest.belongsTo(User);
Couple.belongsTo(User, { as: 'user1Id' });
Couple.belongsTo(User, { as: 'user2Id' });

sequelize.sync({ force: false })
  .then(() => console.log('users table has been successfully created, if one doesn\'t exist'))
  .catch(error => console.log('This error occured', error));

exports.sequelize = sequelize;
exports.User = User;
exports.Date = Date;
exports.UserInterest = UserInterest;
exports.Couple = Couple;
exports.Category = Category;
exports.Spot = Spot;
