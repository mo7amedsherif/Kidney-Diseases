const mongoose = require("mongoose");

const userSymptomsSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        symptoms: {
            type: [String],
            required: true
        },
        additionalNotes: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('UserSymptoms', userSymptomsSchema);

