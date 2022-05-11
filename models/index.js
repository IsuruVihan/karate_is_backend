const {Sequelize, DataTypes} = require('sequelize');

// Config
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT
});

// Authenticate
sequelize.authenticate()
  .then(() => {
    console.log("> DATABASE AUTHENTICATED");
  })
  .catch((error) => {
    console.log("> DATABASE AUTHENTICATION ERROR: ", error);
  });

const db = {};

// Tables
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.Player = require('./Player')(sequelize, DataTypes);
db.Admin = require('./Admin')(sequelize, DataTypes);
db.ItemGroup = require('./ItemGroup')(sequelize, DataTypes);
db.BorrowRecord = require('./BorrowRecord')(sequelize, DataTypes);
db.BorrowedItemGroup = require('./BorrowedItemGroup')(sequelize, DataTypes);
db.Coach = require('./Coach')(sequelize, DataTypes);

/* Relations */

// (Player - BorrowRecord)
db.Player.hasMany(db.BorrowRecord);
db.BorrowRecord.belongsTo(db.Player);
// (BorrowRecord - BorrowedItemGroup)
db.BorrowRecord.hasMany(db.BorrowedItemGroup);
db.BorrowedItemGroup.belongsTo(db.BorrowRecord);
// (BorrowedItemGroup - ItemGroup)
db.BorrowedItemGroup.belongsTo(db.ItemGroup);

// Sync
db.sequelize.sync()
  .then(() => {
    console.log("> DATABASE SYNCED");
  })
  .catch((error) => {
    console.log("> DATABASE SYNC ERROR: ", error);
  });

module.exports = db;
