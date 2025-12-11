const express = require('express');
const router = express.Router();
const { verifyToken ,verifyTokenAndAdmin} = require('../middleware/rouleStatus.middleware');
const {symptomsValidation}=require('../middleware/symptoms.validation');
const { diagnoseDisease, getDiagnosisHistory } = require('../controller/diagnose.controller');
const {getSymptomsFromUser}=require('../controller/userSymptoms.controller');

router.post('/', verifyToken, symptomsValidation,getSymptomsFromUser, diagnoseDisease);

router.get('/history', verifyTokenAndAdmin, getDiagnosisHistory);

module.exports = router;

