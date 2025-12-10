const { validationResult } = require('express-validator');
function validateResult(req, res, next) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        let errors = result.array().map(err => ({ field: err.param, message: err.msg }));
        return res.status(400).json(responseFormatter(false, 'Validation failed', errors));
    }
    next();
}
module.exports = {
    validateResult
};