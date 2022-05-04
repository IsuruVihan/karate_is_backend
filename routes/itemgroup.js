const express = require('express');
const router = express.Router();

// Controllers
const { getQuantity, updateQuantity } = require('../controllers/itemgroup');

// Middleware
const { validateToken } = require("../middleware/auth");

// Endpoints
router.get('/item/:id', validateToken, getQuantity);
router.put('/item/update/:id', validateToken, updateQuantity);

module.exports = router;
