const responseFormatter = require('../utils/responseFormatter');

const validateDiagnosisInput = (req, res, next) => {
    try {
        const { symptoms } = req.body;

        // Check if symptoms exists
        if (!symptoms) {
            return res.status(400).json(
                responseFormatter(false, "Symptoms object is required")
            );
        }

        // Check if symptoms is an object (not array, not null, not primitive)
        if (typeof symptoms !== 'object' || Array.isArray(symptoms) || symptoms === null) {
            return res.status(400).json(
                responseFormatter(false, "Symptoms must be an object (map) with symptom names as keys and 0 or 1 as values")
            );
        }

        // Check if object is not empty
        const symptomKeys = Object.keys(symptoms);
        if (symptomKeys.length === 0) {
            return res.status(400).json(
                responseFormatter(false, "Symptoms object cannot be empty")
            );
        }

        // Validate all values are strictly numbers (0 or 1)
        for (const [key, value] of Object.entries(symptoms)) {
            // Check if value is a number (not string, not NaN, not null, not undefined)
            if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) {
                return res.status(400).json(
                    responseFormatter(false, `Symptom "${key}" must have a numeric value (0 or 1), received: ${value}`)
                );
            }

            // Check if value is strictly 0 or 1 (not 0.0, 1.0, or any other number)
            if (value !== 0 && value !== 1) {
                return res.status(400).json(
                    responseFormatter(false, `Symptom "${key}" must have a value of exactly 0 or 1, received: ${value}`)
                );
            }
        }

        // Validation passed
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

