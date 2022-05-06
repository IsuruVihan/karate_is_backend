module.exports = (sequelize, DataTypes) => {
  return sequelize.define("BorrowedItemGroup", {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {timestamps: false});
}
