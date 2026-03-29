const express = require('express');
const router = express.Router();
const { uploadRecord, getPatientRecords, getPendingRecords, approveRecord, getRecordsByDoctor } = require('../controllers/recordController');

router.post('/upload', uploadRecord);
router.get('/pending/:doctorId', getPendingRecords);     // ✅ before /:patientId
router.get('/doctor/:doctorId', getRecordsByDoctor);     // ✅ NEW — before /:patientId
router.get('/:patientId', getPatientRecords);
router.put('/approve/:id', approveRecord);

module.exports = router;