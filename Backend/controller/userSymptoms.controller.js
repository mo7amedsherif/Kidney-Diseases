const responseFormatter = require("../utils/responseFormatter");
const userSymptomsModel = require("../models/userSymptoms.model");

const getSymptomsFromUser = async (req, res,next) => {
    try {
        const { symptoms, additionalNotes } = req.body;
        const userId = req.user.id;
        const createdSymptoms = await userSymptomsModel.create({
            userId,
            symptoms,
            additionalNotes: additionalNotes || ""
        });
        if (createdSymptoms) {
            req.userSymptomsId = createdSymptoms._id;
            next();
        } else {
            res.status(500).json(responseFormatter(false, "Failed to save user symptoms"));
        }
    } catch (error) {
        res.status(500).json(responseFormatter(false, "Server Error"));
    }
};
module.exports = { getSymptomsFromUser };