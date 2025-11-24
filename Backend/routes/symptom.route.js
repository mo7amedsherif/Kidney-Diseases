const express = require('express');
const router = express.Router();

// Import controller
const { getAllSymptoms } = require('../controller/symptoms.controller');

// GET route for symptoms list (public endpoint)
router.get('/', getAllSymptoms);

module.exports = router;

