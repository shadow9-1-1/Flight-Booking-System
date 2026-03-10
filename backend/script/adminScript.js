require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/db');

const AdminScript = async () => {
  await connectDB();

  try {
    const existing = await User.findOne({ email: 'admin@email.com' });

    if (existing) {
      console.log('Admin account already exists. Skipping script.');
      process.exit(0);
    }

    await User.create({
      name: 'Admin',
      email: 'admin@email.com',
      password: 'admin123',
      role: 'admin',
      isVerified: true,
    });

    console.log('Admin account created successfully.');
    console.log('Email   : admin@email.com');
    console.log('Password: admin123');
  } catch (error) {
    console.error('Failed to create admin:', error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

AdminScript();
