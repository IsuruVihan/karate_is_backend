const express = require('express');
const router = express.Router();

// Controllers
const { createRecord, getBorrowRecords, returnEquipments } = require('../controllers/borrowrecord');

// Middleware
const { validateToken } = require("../middleware/auth");

// Endpoints
router.post('/borrow', validateToken, createRecord);
router.get('/borrow', validateToken, getBorrowRecords);
router.put('/borrow/return/:borrowRecordId', validateToken, returnEquipments);

module.exports = router;
