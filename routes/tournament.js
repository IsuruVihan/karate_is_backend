const express = require('express');
const router = express.Router();

// Controllers
const { createTournament, getTournaments, updateTournament } = require('../controllers/tournament');

// Middleware
const { validateToken } = require("../middleware/auth");

// Endpoints
router.post('/tournament', validateToken, createTournament);
router.get('/tournament', validateToken, getTournaments);
router.put('/tournament', validateToken, updateTournament);

module.exports = router;
