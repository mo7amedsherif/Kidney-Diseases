const responseFormatter = require("../utils/responseFormatter");

// Define the exact symptom keys and their display names
const SYMPTOM_LIST = [
    { key: "back_pain", name: "Back Pain", description: "Pain in the back area" },
    { key: "swelling", name: "Swelling", description: "Abnormal swelling in body parts" },
    { key: "low_urine", name: "Low Urine Output", description: "Decreased urine production" },
    { key: "fever", name: "Fever", description: "Elevated body temperature" },
    { key: "blood_in_urine", name: "Blood in Urine", description: "Presence of blood in urine" },
    { key: "nausea", name: "Nausea", description: "Feeling of sickness with inclination to vomit" },
    { key: "vomiting", name: "Vomiting", description: "Forceful expulsion of stomach contents" },
    { key: "fatigue", name: "Fatigue", description: "Extreme tiredness or exhaustion" },
    { key: "loss_of_appetite", name: "Loss of Appetite", description: "Reduced desire to eat" },
    { key: "burning_urination", name: "Burning Urination", description: "Pain or burning sensation during urination" },
    { key: "dark_urine", name: "Dark Urine", description: "Unusually dark colored urine" },
    { key: "abdomen_pain", name: "Abdomen Pain", description: "Pain in the abdominal area" }
];

const getAllSymptoms = async (req, res) => {
    try {
        // Return the symptom list for frontend and AI model
        res.status(200).json(
            responseFormatter(true, "Symptoms list fetched successfully", SYMPTOM_LIST)
        );
    } catch (error) {
        console.error("Get Symptoms Error:", error);
        res.status(500).json(
            responseFormatter(false, "Server Error: " + error.message)
        );
    }
};

module.exports = {
    getAllSymptoms
};

