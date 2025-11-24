const mongoose = require("mongoose");
//بحط النتيجه هنا بتاع المريض
const diagnosisSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,// دا خاص ب mongodb
            ref: 'User',//بيربط الاعراض مع المستخدم
            required: true
        },
        //دا ملف الاعراض الي اخترها المريض
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
        //دي الاعراض الي موجوده عنده فقظ 1
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

