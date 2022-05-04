const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const db = require('../models/index');
const Admin = db.Admin;

exports.createAdmin = async (req, res) => {
  const hash = await bcrypt.hash(req.body.password, 10);
  Admin.create({
    username: req.body.username,
    password: hash
  }).then((result) => {
    res.status(200).json({
      message: 'Admin account has been created successfully.',
      username: result.username
    });
  }).catch((error) => {
    res.status(400).json({
      message: 'Username already exist in the system.'
    });
    console.log('> CREATE ADMIN ERROR: ', error);
  });
}

exports.changePassword = async (req, res) => {
  const {refreshtoken} = req.headers;
  jwt.verify(refreshtoken, process.env.JWT_REFRESH_TOKEN_SECRET, (error, decode) => {
    if (error) {
      res.status(400).json({
        message: "Couldn't proceed to change password. Please try again."
      });
      console.log("> CHANGE PASSWORD ERROR (REFRESH TOKEN): ", error);
    } else {
      const loggedInUser = decode.aud;
      const {username, password, newPassword, rePassword} = req.body;
      if (loggedInUser === username) {
        Admin.findAll({
          attributes: ['password'],
          where: {
            username: username
          }
        }).then(async (result) => {
          if (await bcrypt.compare(password, result[0].dataValues.password)) {
            if (newPassword === rePassword) {
              const hash = await bcrypt.hash(newPassword, 10);
              Admin.update({password: hash}, {
                where: {
                  username: username
                }
              }).then(() => {
                res.status(200).json({
                  message: 'Password has been updated successfully.'
                });
              }).catch((error3) => {
                res.status(400).json({
                  message: "Couldn't proceed to change password. Please try again."
                });
                console.log("> CHANGE PASSWORD ERROR (UPDATE PASSWORD): ", error3);
              });
            } else {
              res.status(400).json({
                message: "Passwords are not matching."
              });
            }
          } else {
            res.status(400).json({
              message: "Username or current password is incorrect."
            });
          }
        }).catch((error2) => {
          res.status(400).json({
            message: "Couldn't proceed to change password. Please try again."
          });
          console.log("> CHANGE PASSWORD ERROR (SELECT CURRENT PASSWORD): ", error2);
        });
      } else {
        res.status(400).json({
          message: "Couldn't proceed to change password. Please try again."
        });
      }
    }
  });
}

exports.deleteAdmin = async (req, res) => {
  const {refreshtoken} = req.headers;
  jwt.verify(refreshtoken, process.env.JWT_REFRESH_TOKEN_SECRET, (error, decode) => {
    if (error) {
      res.status(400).json({
        message: "Couldn't proceed to delete admin. Please try again."
      });
      console.log("> DELETE ADMIN ERROR (REFRESH TOKEN): ", error);
    } else {
      const {username, password} = req.body;
      if (decode.aud === username) {
        Admin.findAll({
          attributes: ['password'],
          where: {
            username: username,
          }
        }).then(async (result) => {
          if (await bcrypt.compare(password, result[0].dataValues.password)) {
            Admin.destroy({
              where: {
                username: username
              }
            }).then(() => {
              res.status(200).json({
                message: "Admin account has been removed successfully."
              });
            }).catch((error2) => {
              res.status(400).json({
                message: "Couldn't proceed to delete admin account. Please try again."
              });
              console.log("> DELETE ADMIN ERROR (DATABASE): ", error2);
            });
          } else {
            res.status(400).json({
              message: "Credentials are incorrect."
            });
          }
        }).catch((error) => {
          res.status(400).json({
            message: "Couldn't proceed to delete admin account. Please try again."
          });
          console.log("> DELETE ADMIN ERROR (CURRENT PASSWORD): ", error);
        });
      } else {
        res.status(400).json({
          message: 'Credentials are incorrect.'
        });
      }
    }
  });
}
