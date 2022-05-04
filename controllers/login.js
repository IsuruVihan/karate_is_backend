const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const db = require('../models/index');
const {Admin} = db;

exports.logUser = (req, res) => {
  Admin.findAll({
    attributes: ['password'],
    where: {username: req.body.username}
  })
    .then(async (result) => {
      if (await bcrypt.compare(req.body.password, result[0].password)) {
        const accessToken = jwt.sign(
          {aud: req.body.username, iss: 'UoC Team Karate'},
          process.env.JWT_ACCESS_TOKEN_SECRET,
          {expiresIn: '1m'}
        );
        const refreshToken = jwt.sign(
          {aud: req.body.username, iss: 'UoC Team Karate'},
          process.env.JWT_REFRESH_TOKEN_SECRET,
          {expiresIn: '1y'}
        );
        res.status(200).json({
          message: 'Logged in successfully.',
          username: req.body.username,
          accessToken: accessToken,
          refreshToken: refreshToken
        });
      } else {
        res.status(400).json({
          message: 'Incorrect username or password.'
        });
        console.log("> LOGIN ERROR (INCORRECT PASSWORD)");
      }
    })
    .catch((error) => {
      res.status(400).json({
        message: 'Incorrect username or password.',
      });
      console.log("> LOGIN ERROR (USER DOESN'T EXIST): ", error);
    });
}

exports.currentLoggedInUser = (req, res) => {
  const {accesstoken, refreshtoken} = req.headers;
  if (!accesstoken || !refreshtoken) {
    return res.status(400).json({
      username: null,
      newAccessToken: null,
      newRefreshToken: null
    });
  } else {
    jwt.verify(accesstoken, process.env.JWT_ACCESS_TOKEN_SECRET, (error, decode) => {
      if (error) {
        jwt.verify(refreshtoken, process.env.JWT_REFRESH_TOKEN_SECRET, (error2, decode2) => {
          if (error2) {
            return res.status(200).json({
              username: null,
              newAccessToken: null,
              newRefreshToken: null
            });
          } else {
            const newAccessToken = jwt.sign(
              {aud: decode2.aud, iss: 'UoC Team Karate'},
              process.env.JWT_ACCESS_TOKEN_SECRET,
              {expiresIn: '1m'}
            );
            const newRefreshToken = jwt.sign(
              {aud: decode2.aud, iss: 'UoC Team Karate'},
              process.env.JWT_REFRESH_TOKEN_SECRET,
              {expiresIn: '1y'}
            );
            return res.status(200).json({
              username: decode2.aud,
              newAccessToken: newAccessToken,
              newRefreshToken: newRefreshToken
            });
          }
        });
      } else {
        return res.status(200).json({
          username: decode.aud,
          newAccessToken: null,
          newRefreshToken: null
        });
      }
    });
  }
}
