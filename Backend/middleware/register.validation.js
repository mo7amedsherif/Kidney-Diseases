const {  body } = require('express-validator');
const  {validateResult} = require('./validation.middleware');

const registerValidation = [
    body('firstName').notEmpty().withMessage('First name is required').isLength({ min: 2, max: 30 }).withMessage('First name must between 2 and 30 characters'),
    body('lastName').notEmpty().withMessage('Last name is required').isLength({ min: 2, max: 30 }).withMessage('Last name must between 2 and 30 characters'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('gender').optional().isIn(['male', 'female']).withMessage('Gender must be either male or female'),
    body('age').notEmpty().withMessage('Age is required').isInt({ min: 12, max: 99 }).withMessage('Age must be a positive integer'),
    validateResult
];
module.exports = { registerValidation };




