const express = require('express');
const router = express.Router();

// Import controller
const { diagnoseDisease } = require('../controller/diagnose.controller');

// Import authentication middleware
const { verifyToken } = require('../middleware/rouleStatus.middleware');

// POST route for disease diagnosis (protected)
router.post('/', verifyToken, diagnoseDisease);

module.exports = router;

