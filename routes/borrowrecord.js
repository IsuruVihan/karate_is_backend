const express = require('express');
const router = express.Router();

// Controllers
const { createRecord } = require('../controllers/borrowrecord');

// Middleware
const { validateToken } = require("../middleware/auth");

// Endpoints
router.post('/borrow', validateToken, createRecord);

module.exports = router;
