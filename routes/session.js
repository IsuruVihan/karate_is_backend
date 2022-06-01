const express = require('express');
const router = express.Router();

// Controllers
const { createSession, getPastSessions, getOngoingSession } = require('../controllers/session');

// Middleware
const { validateToken } = require("../middleware/auth");

// Endpoints
router.post('/session', validateToken, createSession);
router.get('/session', validateToken, getPastSessions);
router.get('/session/ongoing', validateToken, getOngoingSession);
// router.put('/session', validateToken, updateSession);

module.exports = router;
