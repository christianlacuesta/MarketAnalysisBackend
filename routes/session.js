const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/session');

router.post('/session/create-session', [], sessionController.createNewSession);

module.exports = router;