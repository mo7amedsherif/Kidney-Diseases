const UserSymptoms = require("../models/userSymptoms.model");
const Diagnosis = require("../models/diagnosis.model");
const responseFormatter = require("../utils/responseFormatter");
const axios = require("axios");
const mongoose = require("mongoose");

const diagnoseDisease = async (req, res) => {
    try {
        const  userSymptomsId = req.userSymptomsId;
        const userId = req.user.id;
        if (!userSymptomsId) {
            return res.status(400).json(
                responseFormatter(false, "User symptoms ID is required for diagnosis")
            );
        }
        const symptomsEntry = await UserSymptoms.findById(userSymptomsId);
        if (!symptomsEntry) {
            return res.status(404).json(
                responseFormatter(false, "no symptoms found for the given ID")
            );
        }
        const symptomsData = Object.fromEntries(symptomsEntry.symptoms);
        const userSymptoms = symptomsEntry;
        let predictedDisease;
        let confidence;
        try {
            const mlApiResponse = await axios.post(
                "http://127.0.0.1:5000/predict",
                {
                    symptoms: symptomsData
                },
                {
                    timeout: 10000,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            if (mlApiResponse.data) {
                predictedDisease = mlApiResponse.data.disease ||
                    mlApiResponse.data.predicted_disease ||
                    mlApiResponse.data.prediction;
                confidence = mlApiResponse.data.confidence ||
                    mlApiResponse.data.confidence_score ||0;
            } else {
                throw new Error("Invalid response from ML API: empty response");
            }
        } catch (mlApiError) {
            console.error("ML API Error:", mlApiError.message);
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

        if (!predictedDisease || typeof predictedDisease !== 'string' || predictedDisease.trim() === '') {
            return res.status(500).json(
                responseFormatter(false, "Invalid response from ML API: missing or invalid disease prediction")
            );
        }
        const confidenceNum = Number(confidence);
        if (isNaN(confidenceNum) || confidenceNum < 0 || confidenceNum > 100) {
            confidence = 0;
        } else {
            confidence = confidenceNum;
        }

        const activeSymptoms = Object.keys(symptoms).filter(key => symptoms[key] === 1);
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
        res.status(200).json(
            responseFormatter(true, "Diagnosis completed successfully", {
                diagnosisId: diagnosis._id,
                predictedDisease: diagnosis.predictedDisease,
                confidence: diagnosis.confidence,
                activeSymptoms: activeSymptoms,
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
        const diagnoses = await Diagnosis.find({ userId })
            .select('predictedDisease confidence symptoms createdAt userSymptomsId')
            .sort({ createdAt: -1 })
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

