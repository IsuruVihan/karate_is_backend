const db = require('../models/index');
const ItemGroup = db.ItemGroup;

exports.getQuantity = async (req, res) => {
  ItemGroup.findAll({
    attributes: ['availableQuantity'],
    where: {
      id: req.params.id
    }
  })
    .then((results) => {
      res.status(200).json({
        quantity: results
      });
    })
    .catch((error) => {
      res.status(400).json({
        message: `Unable to retrieve item quantity. (Id: ${req.params.id})`
      });
      console.log('> RETRIEVE ITEM QUANTITY ERROR: ', error);
    });
}

exports.updateQuantity = async (req, res) => {
  ItemGroup.update({availableQuantity: req.body.newQuantity}, {
    where: {
      id: req.params.id
    }
  })
    .then(() => {
      res.status(200).json({
        message: 'Available quantity has been updates successfully.'
      });
    })
    .catch((error) => {
      res.status(400).json({
        message: 'Unable to update item quantity.'
      });
      console.log('> UPDATE ITEM QUANTITY ERROR: ', error);
    });
}
