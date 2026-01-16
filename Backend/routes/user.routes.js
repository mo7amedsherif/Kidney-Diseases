const express = require('express');
const router = express.Router();
const { getUserProfile, registerUser, loginUser,getAllUsers } = require('../controller/user.controller');
const { registerValidation } = require('../middleware/register.validation');
const { verifyToken, verifyTokenAndAdmin } = require('../middleware/rouleStatus.middleware');
router.post('/register', registerValidation, registerUser);

router.post('/login', loginUser);

router.get('/profile/:id', verifyToken, getUserProfile);

router.get('/profile', verifyTokenAndAdmin, getAllUsers);

module.exports = router;

