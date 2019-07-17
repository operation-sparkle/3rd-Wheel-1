const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

const sequelize = new Sequelize('3rd-wheel', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

const User = sequelize.define('user', {
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
}, {
  hooks: {
    beforeCreate: (user) => {
      const salt = bcrypt.genSaltSync(10);
      user.password = bcrypt.hashSync(user.password, salt);
    },
  },
  instanceMethods: {
    validPassword(password) {
      return bcrypt.compareSync(password, this.password);
    },
  },
},
{ sequelize, modelName: 'user' });

const Date = sequelize.define('date', {
  id: Sequelize.NUMBER,
}, { sequelize, modelName: 'date' });

const UserInterest = sequelize.define('userInterest', {
  id: Sequelize.NUMBER,
}, { sequelize, modelName: 'userInterest' });

const Couple = sequelize.define('couple', {
  id: Sequelize.NUMBER,
}, { sequelize, modelName: 'couple' });

const Category = sequelize.define('category', {
  id: Sequelize.NUMBER,
  name: Sequelize.STRING,
}, { sequelize, modelName: 'category' });

const Spot = sequelize.define('spot', {
  id: Sequelize.NUMBER,
  name: Sequelize.STRING,
  latitude: Sequelize.NUMBER,
  longitude: Sequelize.NUMBER,
}, { sequelize, modelName: 'spot' });

Category.belongsTo(Category, { as: 'children', foreignKey: 'parentId', useJunctionTable: false });
Date.belongsTo(Spot);
Date.belongsTo(Couple);
UserInterest.belongsTo(Category);
UserInterest.belongsTo(User);
Couple.belongsTo(User, { as: 'user1Id' });
Couple.belongsTo(User, { as: 'user2Id' });

sequelize.sync()
  .then(() => console.log('users table has been successfully created, if one doesn\'t exist'))
  .catch(error => console.log('This error occured', error));

exports.sequelize = sequelize;
exports.User = User;
exports.Date = Date;
exports.UserInterest = UserInterest;
exports.Couple = Couple;
exports.Category = Category;
exports.Spot = Spot;
