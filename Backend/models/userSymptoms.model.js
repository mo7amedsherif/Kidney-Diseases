const mongoose = require("mongoose");

const userSymptomsSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        symptoms: {
            type: Map,
            of: Number,
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

