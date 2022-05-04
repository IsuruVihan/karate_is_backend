module.exports = (sequelize, DataTypes) => {
  return sequelize.define("ItemGroup", {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false
    },
    size: {
      type: DataTypes.STRING,
      allowNull: false
    },
    availableQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {timestamps: false});
}
