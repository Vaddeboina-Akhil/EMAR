const express = require('express');
const multer = require('multer');
const router = express.Router();
const { authMiddleware, allowStaff, allowDoctor, allowPatient } = require('../middleware/authMiddleware');
const {
  createDraftRecord,
  submitRecord,
  getStaffRecords,
  uploadRecord,
  getPatientRecords,
  getPendingRecords,
  approveRecord,
  getRecordsByDoctor
} = require('../controllers/recordController');

// Multer configuration for PDF uploads
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// 📋 STAFF APIs (protected)
router.post('/staff/create-draft', authMiddleware, allowStaff, createDraftRecord);
router.put('/staff/submit/:id', authMiddleware, allowStaff, submitRecord);
router.get('/staff/:staffId', authMiddleware, allowStaff, getStaffRecords);

// 👨‍⚕️ DOCTOR APIs (protected)
router.get('/pending/:doctorId', authMiddleware, allowDoctor, getPendingRecords);
router.put('/approve/:id', authMiddleware, allowDoctor, approveRecord);
router.get('/doctor/:doctorId', authMiddleware, allowDoctor, getRecordsByDoctor);

// 👤 PATIENT APIs (protected)
router.get('/:patientId', authMiddleware, allowPatient, getPatientRecords);

// Upload endpoint with file handling
router.post('/upload', upload.single('pdfFile'), uploadRecord);

module.exports = router;