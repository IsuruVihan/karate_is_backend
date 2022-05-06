const db = require('../models/index');
const BorrowRecord = db.BorrowRecord;

exports.createRecord = async (req, res) => {
  const {playerId, reason, borrowDate, returnDate, quantities} = req.body;
  res.status(200).json({
    player: playerId,
    reason: reason,
    borrowDate: borrowDate,
    returnDate: returnDate,
    quantities: quantities
  });
  // Player.create({
  //
  // }).then(() => {
  //   res.status(200).json({
  //     message: 'Player has been created successfully.'
  //   });
  // }).catch((error) => {
  //   res.status(400).json({
  //     message: 'Unable to create the player.'
  //   });
  //   console.log('> CREATE PLAYER ERROR: ', error);
  // });
}
