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
      allowNull: false,
      unique: true
    },
    venue: {
      type: DataTypes.STRING,
      allowNull: false
    },
    from: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    to: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    ongoing: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    result: {
      type: DataTypes.STRING(1000),
      allowNull: false
    }
  });
}
