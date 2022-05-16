module.exports = (sequelize, DataTypes) => {
  return sequelize.define("TeamPlayer", {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false
    },
    achievements: {
      type: DataTypes.STRING(1000),
      allowNull: false
    }
  });
}
