const mongoose = require('mongoose');
require('dotenv').config();

const Doctor = require('./src/models/Doctor');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  }
};

const fixDoctorStatuses = async () => {
  try {
    // Approve the main test doctor
    const mainDoctor = await Doctor.findOneAndUpdate(
      { licenseId: 'MED1235' },
      { status: 'approved' },
      { new: true }
    );
    
    if (mainDoctor) {
      console.log('✅ Approved main doctor:');
      console.log(`   Name: ${mainDoctor.name}`);
      console.log(`   License: ${mainDoctor.licenseId}`);
      console.log(`   Email: ${mainDoctor.email}`);
      console.log(`   Status: ${mainDoctor.status}`);
    } else {
      console.log('⚠️  Main doctor not found');
    }

    // Approve a few other doctors for testing
    const result = await Doctor.updateMany(
      { status: 'pending' },
      { status: 'approved' },
      { limit: 3 }
    );
    
    console.log(`\n✅ Approved ${result.modifiedCount} additional doctors for testing`);
    
    console.log('\n═══════════════════════════════════════════════════');
    console.log('🎯 DOCTORS NOW ABLE TO LOGIN:');
    console.log('═══════════════════════════════════════════════════\n');
    
    const approvedDocs = await Doctor.find({ status: 'approved' }).select('-password').limit(5);
    approvedDocs.forEach((doc, i) => {
      console.log(`${i + 1}. ${doc.name}`);
      console.log(`   Email: ${doc.email}`);
      console.log(`   Password hint: Use the one you set during signup`);
      console.log('');
    });
    
    console.log('Refresh the doctor dashboard page in browser to see the data.');
    console.log('═══════════════════════════════════════════════════\n');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

connectDB().then(fixDoctorStatuses);
