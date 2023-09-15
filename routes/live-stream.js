const express = require('express');
const router = express.Router();
const liveStreamController = require('../controllers/live-stream');

router.post('/live-stream/get-data', [], liveStreamController.getLiveMarketData);

module.exports = router;