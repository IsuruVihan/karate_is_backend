module.exports = (sequelize, DataTypes) => {
  return sequelize.define("PracticeParticipant", {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false
    }
  }, {timestamps: false});
}
