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

const checkDoctods = async () => {
  try {
    const doctors = await Doctor.find({}).select('-password').limit(5);
    
    console.log('\n═══════════════════════════════════════════════════');
    console.log('📋 DOCTORS IN DATABASE');
    console.log('═══════════════════════════════════════════════════\n');
    
    if (doctors.length === 0) {
      console.log('❌ No doctors found in database!');
    } else {
      doctors.forEach((doc, i) => {
        console.log(`${i + 1}. ${doc.name || 'NO NAME'}`);
        console.log(`   License ID: ${doc.licenseId || 'MISSING'}`);
        console.log(`   Email: ${doc.email || 'MISSING'}`);
        console.log(`   Specialization: ${doc.specialization || 'MISSING'}`);
        console.log(`   Hospital: ${doc.hospitalName || 'MISSING'}`);
        console.log(`   Age: ${doc.age || 'MISSING'}`);
        console.log(`   Status: ${doc.status || 'MISSING'}`);
        console.log(`   Profile Image: ${doc.profileImage ? 'YES (stored)' : 'NO'}`);
        console.log('');
      });
    }
    
    console.log('═══════════════════════════════════════════════════');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

connectDB().then(checkDoctods);
