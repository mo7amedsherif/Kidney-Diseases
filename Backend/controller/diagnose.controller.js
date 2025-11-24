const UserSymptoms = require("../models/userSymptoms.model");
const Diagnosis = require("../models/diagnosis.model");
const responseFormatter = require("../utils/responseFormatter");
const axios = require("axios");

const diagnoseDisease = async (req, res) => {
    try {
        const { symptoms, additionalNotes } = req.body;
        const userId = req.user.id;

        // Step 1: Save symptoms in MongoDB (UserSymptoms collection)
        // Symptoms is already validated by middleware as an object map with 0/1 values
        // Example: { "fever": 1, "pain": 0, "nausea": 1 }
        const userSymptoms = await UserSymptoms.create({
            userId,
            symptoms,
            additionalNotes: additionalNotes || ""
        });

        if (!userSymptoms) {
            return res.status(500).json(
                responseFormatter(false, "Failed to save symptoms")
            );
        }

        // Step 2: Send symptoms to external ML model API (Flask)
        // Flask API expects: { "symptoms": { "fever": 1, "pain": 0 } }
        let predictedDisease;
        let confidence;

        try {
            const mlApiResponse = await axios.post(
                "http://127.0.0.1:5000/predict",
                {
                    symptoms: symptoms  // Send the symptoms object map directly
                },
                {
                    timeout: 10000, // 30 seconds timeout
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Extract predicted disease and confidence from ML API response
            // Handle different possible response formats
            if (mlApiResponse.data) {
                predictedDisease = mlApiResponse.data.disease ||
                    mlApiResponse.data.predicted_disease ||
                    mlApiResponse.data.prediction;
                confidence = mlApiResponse.data.confidence ||
                    mlApiResponse.data.confidence_score ||
                    0;
            } else {
                throw new Error("Invalid response from ML API: empty response");
            }
        } catch (mlApiError) {
            // If ML API fails, still save the symptoms but return error
            console.error("ML API Error:", mlApiError.message);

            // Check if it's a network error or API error
            const errorMessage = mlApiError.response
                ? `ML API returned error: ${mlApiError.response.status} - ${mlApiError.response.statusText}`
                : mlApiError.message;

            return res.status(503).json(
                responseFormatter(false, "ML prediction service is currently unavailable. Symptoms have been saved.", {
                    userSymptomsId: userSymptoms._id,
                    error: errorMessage
                })
            );
        }

        // Validate ML API response
        if (!predictedDisease || typeof predictedDisease !== 'string' || predictedDisease.trim() === '') {
            return res.status(500).json(
                responseFormatter(false, "Invalid response from ML API: missing or invalid disease prediction")
            );
        }

        // Validate confidence is a number between 0 and 100
        const confidenceNum = Number(confidence);
        if (isNaN(confidenceNum) || confidenceNum < 0 || confidenceNum > 100) {
            console.warn(`Invalid confidence value received: ${confidence}, defaulting to 0`);
            confidence = 0;
        } else {
            confidence = confidenceNum;
        }

        // Step 3: Save the diagnosis in Diagnosis collection
        // Extract ONLY the keys where value is 1 (active symptoms) from the symptoms map
        // Example: { "fever": 1, "pain": 0, "nausea": 1 } -> ["fever", "nausea"]
        const activeSymptoms = Object.keys(symptoms).filter(key => symptoms[key] === 1);

        // Ensure we have at least one active symptom
        if (activeSymptoms.length === 0) {
            return res.status(400).json(
                responseFormatter(false, "At least one active symptom (value = 1) is required for diagnosis")
            );
        }

        const diagnosis = await Diagnosis.create({
            userId,
            userSymptomsId: userSymptoms._id,
            predictedDisease: predictedDisease.trim(),
            confidence: confidence,
            symptoms: activeSymptoms
        });

        if (!diagnosis) {
            return res.status(500).json(
                responseFormatter(false, "Failed to save diagnosis")
            );
        }

        // Step 4: Return the result back to the frontend
        // Return activeSymptoms list so the user sees what they were diagnosed based on
        res.status(200).json(
            responseFormatter(true, "Diagnosis completed successfully", {
                diagnosisId: diagnosis._id,
                predictedDisease: diagnosis.predictedDisease,
                confidence: diagnosis.confidence,
                activeSymptoms: activeSymptoms,  // Array of symptom names with value = 1
                userSymptomsId: userSymptoms._id,
                createdAt: diagnosis.createdAt
            })
        );

    } catch (error) {
        console.error("Diagnosis Error:", error);
        res.status(500).json(
            responseFormatter(false, "Server Error: " + error.message)
        );
    }
};

const getDiagnosisHistory = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get all diagnoses for the logged-in user
        const diagnoses = await Diagnosis.find({ userId })
            .select('predictedDisease confidence symptoms createdAt userSymptomsId')
            .sort({ createdAt: -1 }) // Most recent first
            .populate('userSymptomsId', 'symptoms additionalNotes createdAt');

        res.status(200).json(
            responseFormatter(true, "Diagnosis history fetched successfully", diagnoses)
        );
    } catch (error) {
        console.error("Get Diagnosis History Error:", error);
        res.status(500).json(
            responseFormatter(false, "Server Error: " + error.message)
        );
    }
};

module.exports = {
    diagnoseDisease,
    getDiagnosisHistory
};

