const express = require('express');
const router = express.Router();

// Import controller
const { diagnoseDisease } = require('../controller/diagnose.controller');

// Import authentication middleware
const { verifyToken } = require('../middleware/rouleStatus.middleware');

// Import validation middleware
const { validateDiagnosisInput } = require('../middleware/diagnose.validation');

// POST route for disease diagnosis (protected)
router.post('/', verifyToken, validateDiagnosisInput, diagnoseDisease);

module.exports = router;

