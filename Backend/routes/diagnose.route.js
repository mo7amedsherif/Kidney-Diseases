const express = require('express');
const router = express.Router();

// Import controller
const { diagnoseDisease, getDiagnosisHistory } = require('../controller/diagnose.controller');

// Import authentication middleware
const { verifyToken } = require('../middleware/rouleStatus.middleware');

// Import validation middleware
const { validateDiagnosisInput } = require('../middleware/diagnose.validation');

// POST route for disease diagnosis (protected)
router.post('/', verifyToken, validateDiagnosisInput, diagnoseDisease);

// GET route for diagnosis history (protected)
router.get('/history', verifyToken, getDiagnosisHistory);

module.exports = router;

