const express = require('express');
const router = express.Router();
const { requestAccess, getPatientConsents, respondConsent, getAccessLogs, getConsentsByDoctor, seedTestLogs } = require('../controllers/consentController');

router.post('/request', requestAccess);
router.post('/seed-test-logs', seedTestLogs);         // ✅ TEMP TEST ENDPOINT
router.get('/doctor/:doctorId', getConsentsByDoctor); // ✅ NEW — before /:patientId
router.get('/:patientId', getPatientConsents);
router.put('/:id', respondConsent);
router.get('/logs/:patientId', getAccessLogs);

module.exports = router;