const {Sequelize, DataTypes} = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT
});

sequelize.authenticate()
  .then(() => {
    console.log("> DATABASE AUTHENTICATED");
  })
  .catch((error) => {
    console.log("> DATABASE AUTHENTICATION ERROR: ", error);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.Player = require('./Player')(sequelize, DataTypes);
db.Admin = require('./Admin')(sequelize, DataTypes);
db.ItemGroup = require('./ItemGroup')(sequelize, DataTypes);

db.sequelize.sync()
  .then(() => {
    console.log("> DATABASE SYNCED");
  })
  .catch((error) => {
    console.log("> DATABASE SYNC ERROR: ", error);
  });

module.exports = db;