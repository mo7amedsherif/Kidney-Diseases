const { validationResult, body } = require('express-validator');
const responseFormatter = require('../utils/responseFormatter');

//middleware to handle validation results
function validateRequest(req, res, next) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        let errors = result.array().map(err => ({ field: err.param, message: err.msg }));
        return res.status(400).json(responseFormatter(false, 'Validation failed', errors));
    }
    next();
}

//validation rules for user registration
const registerValidation = [
    body('firstName').notEmpty().withMessage('First name is required').isLength({ min: 2, max: 30 }).withMessage('First name must between 2 and 30 characters'),
    body('lastName').notEmpty().withMessage('Last name is required').isLength({ min: 2, max: 30 }).withMessage('Last name must between 2 and 30 characters'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('gender').optional().isIn(['male', 'female']).withMessage('Gender must be either male or female'),
    body('age').notEmpty().withMessage('Age is required').isInt({ min: 12, max: 99 }).withMessage('Age must be a positive integer'),
    validateRequest
];
module.exports = { registerValidation };




