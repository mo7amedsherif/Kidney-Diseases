const express = require('express');
const router = express.Router();

// Import controller
const { getUserProfile, registerUser, loginUser } = require('../controller/user.controller');

// Import validation middleware
const { registerValidation } = require('../middleware/validation');

// Import authentication middleware
const { verifyToken } = require('../middleware/rouleStatus.middleware');

// POST route for user registration
router.post('/register', registerValidation, registerUser);

// POST route for user login
router.post('/login', loginUser);

// GET route for user profile (protected)
router.get('/profile', verifyToken, getUserProfile);

module.exports = router;

