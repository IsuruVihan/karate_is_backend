const express = require('express');
const router = express.Router();

// Controllers
const { updateCoach, getCoach } = require('../controllers/coach');

// Middleware
const { validateToken } = require("../middleware/auth");

// Endpoints
router.put('/coach', validateToken, updateCoach);
router.get('/coach', validateToken, getCoach);

module.exports = router;
