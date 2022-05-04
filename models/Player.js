module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Player", {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nameWithInitials: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    gender: {
      type: DataTypes.ENUM,
      values: [
        'Male', 'Female'
      ],
      allowNull: false
    },
    contactNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    province: {
      type: DataTypes.ENUM,
      values: [
        'Central', 'North Central', 'Northern', 'Eastern', 'North Western', 'Southern', 'Uva', 'Sabaragamuwa', 'Western'
      ],
      allowNull: false
    },
    district: {
      type: DataTypes.ENUM,
      values: [
        'Kandy', 'Matale', 'Nuwara Eliya', 'Anuradhapura', 'Polonnaruwa', 'Jaffna', 'Kilinochchi',
        'Mannar', 'Vavuniya', 'Mullativu', 'Alambil', 'Ampara', 'Batticaloa', 'Trincomalee', 'Kurunagala', 'Puttalam',
        'Galle', 'Hambanthota', 'Mathara', 'Badulla', 'Monaragala', 'Kegalle', 'Rathnapura', 'Colombo', 'Gampaha',
        'Kaluthara'
      ],
      allowNull: false
    },
    grade: {
      type: DataTypes.ENUM,
      values: ['Black', '1st Kyu', '2nd Kyu', '3rd Kyu', '4th Kyu', '5th Kyu', '6th Kyu', '7th Kyu',
        '8th Kyu', '9th Kyu', '10th Kyu'
      ],
      allowNull: false
    },
    faculty: {
      type: DataTypes.ENUM,
      values: [
        'Arts', 'Law', 'Management & Finance', 'Medicine', 'Nursing', 'Science', 'Technology',
        'Sri Palee', 'UCSC'
      ],
      allowNull: false
    },
    yearOfStudy: {
      type: DataTypes.ENUM,
      values: [
        'Orientation', '1st', '2nd', '3rd', '4th', '5th', 'Alumni'
      ],
      allowNull: true
    },
    birthdate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    weight: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    registrationNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    picSrc: {
      type: DataTypes.STRING(1000),
      allowNull: false
    }
  });
}
