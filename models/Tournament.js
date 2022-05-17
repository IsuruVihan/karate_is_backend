module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Tournament", {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    venue: {
      type: DataTypes.STRING,
      allowNull: true
    },
    from: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    to: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    ongoing: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    result: {
      type: DataTypes.STRING(1000),
      allowNull: true
    }
  });
}
