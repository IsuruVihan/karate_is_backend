module.exports = (sequelize, DataTypes) => {
  return sequelize.define("PracticeSession", {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false
    },
    venue: {
      type: DataTypes.STRING,
      allowNull: true
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    from: {
      type: DataTypes.TIME,
      allowNull: true
    },
    to: {
      type: DataTypes.TIME,
      allowNull: true
    },
    ongoing: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    coach: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  });
}
