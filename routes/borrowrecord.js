const express = require('express');
const router = express.Router();

// Controllers
const { createRecord, getBorrowRecords } = require('../controllers/borrowrecord');

// Middleware
const { validateToken } = require("../middleware/auth");

// Endpoints
router.post('/borrow', validateToken, createRecord);
router.get('/borrow', validateToken, getBorrowRecords);

module.exports = router;
