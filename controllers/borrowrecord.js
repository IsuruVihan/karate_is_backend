const db = require('../models/index');
const BorrowRecord = db.BorrowRecord;
const BorrowedItemGroup = db.BorrowedItemGroup;
const ItemGroup = db.ItemGroup;
const Player = db.Player;

exports.createRecord = async (req, res) => {
  const {player, reason, borrowDate, returnDate, quantities} = req.body;
  console.log(req.body);
  if (player==='' || reason==='' || borrowDate==='' || returnDate==='') {
    return res.status(400).json({
      message: "Please fill all fields in order to create a borrow record."
    });
  } else {
    let qtyValidation = false;
    const datesValidation = borrowDate <= returnDate;
    for (let i=1; i<quantities.length; i++) {
      if (!(quantities[i]=='' || quantities[i]==0)) {
        qtyValidation = true;
        break;
      }
    }
    if (qtyValidation) {
      if (datesValidation) {
        BorrowRecord.create({borrowedOn: borrowDate, returnOn: returnDate, reason: reason, PlayerId: player})
          .then((borrowRecord) => {
            for (let i=1; i<quantities.length; i++) {
              if (!(quantities[i]=='' || quantities[i]==0)) {
                BorrowedItemGroup.create({quantity: quantities[i], BorrowRecordId: borrowRecord.id, ItemGroupId: i})
                  .then(() => {
                    ItemGroup.findAll({attributes: ['availableQuantity'], where: {id: i}})
                      .then(async (item) => {
                        const newQuantity = item[0].dataValues.availableQuantity - quantities[i];
                        await ItemGroup.update({availableQuantity: newQuantity}, {where: {id: i}});
                      });
                  });
               }
            }
            return res.status(200).json({
              message: "Borrow record has been submitted successfully."
            });
          })
          .catch((error) => {
            console.log("> CREATE BORROW RECORD ERROR: ", error);
            return res.status(400).json({
              message: "Unable to create the borrow record."
            });
          });
      } else {
        return res.status(400).json({
          message: "Please re-check borrowed date and return date."
        });
      }
    } else {
      return res.status(400).json({
        message: "Please fill quantities of the equipments that needs to be borrowed."
      });
    }
  }
}

exports.getBorrowRecords = (req, res) => {
  BorrowRecord.findAll({
    include: [{
      model: Player,
      attributes: ['firstName', 'lastName']
    }, {
      model: BorrowedItemGroup,
      attributes: ['ItemGroupId', 'quantity']
    }]
  })
    .then((borrowRecords) => {
      return res.status(200).json(borrowRecords);
    })
    .catch((error) => {
      console.log("> GET BORROW RECORD DETAILS ERROR: ", error);
      return res.status(400).json({
        message: "Unable to load borrow records."
      });
    });
}

exports.returnEquipments = (req, res) => {
  const {borrowedOn, returnedOn} = req.body;
  if (returnedOn == '') {
    return res.status(400).json({
      message: "Please fill the returned date."
    });
  } else if (borrowedOn == '') {
    return res.status(400).json({
      message: "Unable to proceed. Please try again."
    });
  } else if (returnedOn < borrowedOn) {
    return res.status(400).json({
      message: "Please re-check the returned date."
    });
  } else {
    BorrowRecord.update({returnedOn: returnedOn}, {where: {id: req.params.borrowRecordId}})
      .then(() => {
        BorrowedItemGroup.findAll({
          attributes: ['ItemGroupId', 'quantity'],
          where: {
            BorrowRecordId: req.params.borrowRecordId
          }
        })
          .then((borrowItemGroups) => {
            borrowItemGroups.map((group) => {
              let newItemQuantity = 0;
              ItemGroup.findAll({
                attributes: ['availableQuantity'],
                where: {id: group.dataValues.ItemGroupId}
              })
                .then(async (availableQuantity) => {
                  newItemQuantity = availableQuantity[0].dataValues.availableQuantity + group.dataValues.quantity;
                  await ItemGroup.update({availableQuantity: newItemQuantity}, {where: {id: group.dataValues.ItemGroupId}});
                });
            });
            return res.status(200).json({
              message: "Borrow record returned successfully."
            });
          });
      })
      .catch((error) => {
        console.log("> BORROW RECORD RETURN ERROR: ", error);
        return res.status(400).json({
          message: "Unable to return borrow record."
        });
      });
  }
}
