const mongoose = require("mongoose");

const diagnosisSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        userSymptomsId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserSymptoms',
            required: true
        },
        predictedDisease: {
            type: String,
            required: true,
            trim: true
        },
        confidence: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        },
        symptoms: {
            type: [String],
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Diagnosis', diagnosisSchema);

