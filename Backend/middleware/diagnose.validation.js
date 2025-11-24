const responseFormatter = require('../utils/responseFormatter');

const validateDiagnosisInput = (req, res, next) => {
    try {
        const { symptoms } = req.body;

        if (!symptoms) {
            return res.status(400).json(
                responseFormatter(false, "Symptoms object is required")
            );
        }
        if (typeof symptoms !== 'object' || Array.isArray(symptoms) || symptoms === null) {
            return res.status(400).json(
                responseFormatter(false, "Symptoms must be an object (map) with symptom names as keys and 0 or 1 as values")
            );
        }
        const symptomKeys = Object.keys(symptoms);
        if (symptomKeys.length === 0) {
            return res.status(400).json(
                responseFormatter(false, "Symptoms object cannot be empty")
            );
        }
        for (const [key, value] of Object.entries(symptoms)) {
            if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) {
                return res.status(400).json(
                    responseFormatter(false, `Symptom "${key}" must have a numeric value (0 or 1), received: ${value}`)
                );
            }
            if (value !== 0 && value !== 1) {
                return res.status(400).json(
                    responseFormatter(false, `Symptom "${key}" must have a value of exactly 0 or 1, received: ${value}`)
                );
            }
        }


        next();
    } catch (error) {
        return res.status(500).json(
            responseFormatter(false, "Validation error: " + error.message)
        );
    }
};

module.exports = {
    validateDiagnosisInput
};

