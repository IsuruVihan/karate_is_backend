const express = require('express');
const router = express.Router();

// Controllers
const { createPlayer, getPlayers } = require('../controllers/player');

// Middleware
const { validateToken } = require("../middleware/auth");

// Endpoints
router.post('/player/create', validateToken, createPlayer);
router.get('/players', validateToken, getPlayers);

module.exports = router;
