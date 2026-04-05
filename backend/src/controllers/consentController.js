const Consent = require('../models/Consent');
const AccessLog = require('../models/AccessLog');

const requestAccess = async (req, res) => {
  try {
    const consent = await Consent.create(req.body);
    // 📝 Log the access request
    await AccessLog.create({
      patientId: consent.patientId,
      doctorName: consent.doctorName,
      hospitalName: consent.hospitalName,
      reason: consent.reason,
      accessType: 'requested',
      timestamp: new Date()
    });
    res.status(201).json(consent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getPatientConsents = async (req, res) => {
  try {
    const consents = await Consent.find({ patientId: req.params.patientId });
    res.json(consents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const respondConsent = async (req, res) => {
  try {
    const { status } = req.body;
    const consent = await Consent.findByIdAndUpdate(
      req.params.id,
      { status, responseDate: new Date() },
      { new: true }
    );
    // 📝 Log the response (approved or denied)
    if (status === 'approved' || status === 'denied') {
      await AccessLog.create({
        patientId: consent.patientId,
        doctorName: consent.doctorName,
        hospitalName: consent.hospitalName,
        reason: consent.reason,
        accessType: status,
        timestamp: new Date()
      });
    }
    res.json(consent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAccessLogs = async (req, res) => {
  try {
    const patientIdParam = req.params.patientId;
    
    // Try multiple approaches to find logs
    let logs = [];
    
    // First, try direct lookup (if it's a string patientId like 'EMAR-P-2932')
    logs = await AccessLog.find({ patientId: patientIdParam })
      .sort({ timestamp: -1 });
    
    // If no logs found, try looking up by patient and using their MongoDB _id
    if (logs.length === 0) {
      const Patient = require('../models/Patient');
      const patient = await Patient.findOne({ 
        $or: [{ _id: patientIdParam }, { patientId: patientIdParam }] 
      });
      if (patient) {
        logs = await AccessLog.find({ patientId: patient._id.toString() })
          .sort({ timestamp: -1 });
      }
    }
    
    res.json(logs);
  } catch (err) {
    console.error('Error fetching access logs:', err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ NEW — Get all access requests sent by this doctor
const getConsentsByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const consents = await Consent.find({ doctorId })
      .populate('patientId', 'name patientId email')
      .populate('doctorId', 'name hospitalName')
      .sort({ requestDate: -1 });
    res.json(consents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ TEMP — Seed test audit logs for demo/testing
const seedTestLogs = async (req, res) => {
  try {
    const { patientId } = req.body;
    if (!patientId) {
      return res.status(400).json({ message: 'patientId required in request body' });
    }

    const testLogs = [
      {
        patientId,
        doctorName: 'Dr. AVK. ABHIRAMA PRANEETH',
        hospitalName: 'Rainbow Hospital',
        accessType: 'requested',
        reason: 'Patient medical check',
        recordsAccessed: 'General Checkup',
        timestamp: new Date(Date.now() - 5*24*60*60*1000)
      },
      {
        patientId,
        doctorName: 'Dr. AVK. ABHIRAMA PRANEETH',
        hospitalName: 'Rainbow Hospital',
        accessType: 'approved',
        reason: 'Access granted for patient medical check',
        recordsAccessed: 'General Checkup',
        timestamp: new Date(Date.now() - 4*24*60*60*1000)
      },
      {
        patientId,
        doctorName: 'Staff',
        hospitalName: 'Apollo Hospitals Chennai',
        accessType: 'record_uploaded',
        reason: 'Blood Test uploaded - Routine Checkup',
        recordsAccessed: 'Blood Test',
        timestamp: new Date(Date.now() - 3*24*60*60*1000)
      },
      {
        patientId,
        doctorName: 'Dr. JOHN SMITH',
        hospitalName: 'Apollo Hospitals Chennai',
        accessType: 'record_approved',
        reason: 'Blood Test approved by Dr. JOHN SMITH',
        recordsAccessed: 'Blood Test',
        timestamp: new Date(Date.now() - 2*24*60*60*1000)
      }
    ];

    await AccessLog.insertMany(testLogs);
    res.json({ 
      message: `✅ Created ${testLogs.length} test audit logs for patient ${patientId}`,
      logs: testLogs 
    });
  } catch (err) {
    console.error('Seed error:', err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { requestAccess, getPatientConsents, respondConsent, getAccessLogs, getConsentsByDoctor, seedTestLogs };