const express = require('express');
const router = express.Router();
const summaryAnalysisController = require('../controllers/summary-analysis');

router.post('/summary/get-data', [], summaryAnalysisController.summaryAnalysis);

module.exports = router;