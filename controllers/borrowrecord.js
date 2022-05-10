const db = require('../models/index');
const BorrowRecord = db.BorrowRecord;
const BorrowedItemGroup = db.BorrowedItemGroup;
const ItemGroup = db.ItemGroup;

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
