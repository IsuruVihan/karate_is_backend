module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Admin", {
    username: {
      primaryKey: true,
      unique: true,
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
}
