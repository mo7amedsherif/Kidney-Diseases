const UserSymptoms = require("../models/userSymptoms.model");
const Diagnosis = require("../models/diagnosis.model");
const responseFormatter = require("../utils/responseFormatter");
const axios = require("axios");

const diagnoseDisease = async (req, res) => {
    try {
        const { symptoms, additionalNotes } = req.body;
        const userId = req.user.id;

        // Validate input
        if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
            return res.status(400).json(
                responseFormatter(false, "Symptoms array is required and cannot be empty")
            );
        }

        // Step 1: Save symptoms in MongoDB (UserSymptoms collection)
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
        let predictedDisease;
        let confidence;

        try {
            const mlApiResponse = await axios.post("http://localhost:5000/predict", {
                symptoms: symptoms
            }, {
                timeout: 10000 // 10 seconds timeout
            });

            // Extract predicted disease and confidence from ML API response
            if (mlApiResponse.data) {
                predictedDisease = mlApiResponse.data.disease || mlApiResponse.data.predicted_disease || mlApiResponse.data.prediction;
                confidence = mlApiResponse.data.confidence || mlApiResponse.data.confidence_score || 0;
            } else {
                throw new Error("Invalid response from ML API");
            }
        } catch (mlApiError) {
            // If ML API fails, still save the symptoms but return error
            console.error("ML API Error:", mlApiError.message);
            return res.status(503).json(
                responseFormatter(false, "ML prediction service is currently unavailable. Symptoms have been saved.", {
                    userSymptomsId: userSymptoms._id,
                    error: mlApiError.message
                })
            );
        }

        // Validate ML API response
        if (!predictedDisease) {
            return res.status(500).json(
                responseFormatter(false, "Invalid response from ML API: missing disease prediction")
            );
        }

        // Step 3: Save the diagnosis in Diagnosis collection
        const diagnosis = await Diagnosis.create({
            userId,
            userSymptomsId: userSymptoms._id,
            predictedDisease,
            confidence: confidence || 0,
            symptoms
        });

        if (!diagnosis) {
            return res.status(500).json(
                responseFormatter(false, "Failed to save diagnosis")
            );
        }

        // Step 4: Return the result back to the frontend
        res.status(200).json(
            responseFormatter(true, "Diagnosis completed successfully", {
                diagnosisId: diagnosis._id,
                predictedDisease,
                confidence,
                symptoms,
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

module.exports = {
    diagnoseDisease
};

