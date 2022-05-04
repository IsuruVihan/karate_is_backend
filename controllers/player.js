const db = require('../models/index');
const Player = db.Player;

exports.createPlayer = async (req, res) => {
  const {
    firstName, lastName, nameWithInitials, email, gender, contactNumber, address, province, district, grade, faculty,
    yearOfStudy, birthdate, weight, registrationNumber, picSrc
  } = req.body;
  Player.create({
    firstName: firstName,
    lastName: lastName,
    nameWithInitials: nameWithInitials,
    email: email,
    gender: gender,
    contactNumber: contactNumber,
    address: address,
    province: province,
    district: district,
    grade: grade,
    faculty: faculty,
    yearOfStudy: yearOfStudy,
    birthdate: birthdate,
    weight: weight,
    registrationNumber: registrationNumber,
    picSrc: picSrc
  }).then(() => {
    res.status(200).json({
      message: 'Player has been created successfully.'
    });
  }).catch((error) => {
    res.status(400).json({
      message: 'Unable to create the player.'
    });
    console.log('> CREATE PLAYER ERROR: ', error);
  });
}

exports.getPlayers = async (req, res) => {
  Player.findAll()
    .then((results) => {
      res.status(200).json({
        players: results
      });
    })
    .catch((error) => {
      res.status(400).json({
        message: 'Unable to retrieve player details.'
      });
      console.log('> RETRIEVE PLAYER DETAILS ERROR: ', error);
    });
}
