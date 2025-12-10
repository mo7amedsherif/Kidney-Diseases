const {body} = require('express-validator');
const {validateResult}= require('./validation.middleware')

const symptomsValidation = [
    body('symptoms').exists().withMessage('Symptoms field is required')
    .isObject().withMessage('Symptoms must be an object')
    .custom(value =>{
        if(Object.keys(value).length === 0){
            throw new Error('Symptoms object cannot be empty');
        }
        return true;
    }),// isEmpty does not work as expected for objects
    body('symptoms.*').isInt().withMessage('Each symptom value must be an integer')
    .isIn([0,1]).withMessage('Each symptom value must be either 0 or 1'),

    validateResult

];
module.exports = {
    symptomsValidation
};  