const express = require('express');
const router = express.Router();
const marketDataController = require('../controllers/market-data');

router.post('/market-data/get-data', [], marketDataController.marketHistory);

module.exports = router;