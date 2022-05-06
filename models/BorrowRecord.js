module.exports = (sequelize, DataTypes) => {
  return sequelize.define("BorrowRecord", {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false
    },
    borrowedOn: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    returnOn: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: false
    },
    returnedOn: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {timestamps: false});
}
