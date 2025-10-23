const { validationResult, body } = require('express-validator');

//middleware to handle validation results
function validateRequest(req, res, next) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        let error = result.array().map(err => ({ field: err.param, message: err.msg }));
        return res.status(400).json({ message: 'validation failed', errors: error });
    }
    next();
}

//validation rules for user registration
const registerValidation = [
    body('firstName').notEmpty().withMessage('First name is required').isLength({ min: 2, max: 30 }).withMessage('First name must between 2 and 30 characters'),
    body('lastName').notEmpty().withMessage('Last name is required').isLength({ min: 2, max: 30 }).withMessage('Last name must between 2 and 30 characters'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation does not match password');
        }
        return true;
    }),
    body('gender').isIn(['male','female']).withMessage('Gender must be either male or female'),
    body('birthDate')
        .optional().isISO8601().withMessage('Invalid date format, use YYYY-MM-DD')
        .custom((value) => {
            const inputDate = new Date(value);
            const today = new Date();
            if (inputDate > today) {
                throw new Error('Birth date cannot be in the future');
            }
            return true;
        })
        .toDate(),

    validateRequest
];
module.exports = { registerValidation };




