const db = require('../models/index');
const Coach = db.Coach;

exports.updateCoach = async (req, res) => {
  const {firstName, lastName, nameWithInitials, email, address, birthdate, contactNumber} = req.body;
  if (firstName==''||lastName==''||nameWithInitials==''||email==''||address==''||birthdate==''||contactNumber=='') {
    return res.status(400).json({
      message: "Please fill all the fields."
    });
  } else {
    Coach.update({
      firstName: firstName,
      lastName: lastName,
      nameWithInitials: nameWithInitials,
      email: email,
      address: address,
      birthdate: birthdate,
      contactNumber: contactNumber
    }, {where: {id: 1}})
      .then(() => {
        return res.status(200).json({
          message: "Coach details has been updated successfully."
        });
      })
      .catch((error) => {
        console.log("> UPDATE COACH ERROR: ", error);
        return res.status(400).json({
          message: "Unable to update coach details. Please try again."
        });
      });
  }
}

exports.getCoach = async (req, res) => {
  Coach.findAll({where: {id: 1}})
    .then((result) => {
      return res.status(200).json({
        coach: result
      });
    })
    .catch((error) => {
      console.log("> GET COACH ERROR: ", error);
      return res.status(400).json({
        message: "Unable to get coach details."
      });
    });
}
