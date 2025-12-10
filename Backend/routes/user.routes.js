const express = require('express');
const router = express.Router();

// Import controller
const { getUserProfile, registerUser, loginUser,getAllUsers } = require('../controller/user.controller');

// Import validation middleware
const { registerValidation } = require('../middleware/register.validation');

// Import authentication middleware
const { verifyToken, verifyTokenAndAdmin } = require('../middleware/rouleStatus.middleware');

// POST route for user registration
router.post('/register', registerValidation, registerUser);

// POST route for user login
router.post('/login', loginUser);

// GET route for user profile (protected)
router.get('/profile/:id', verifyToken, getUserProfile);
router.get('/profile', verifyTokenAndAdmin, getAllUsers);

module.exports = router;

