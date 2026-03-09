const User = require('../models/User');

const register = async (req, res) => {
  const { name, email, password } = req.body;

  
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide name, email, and password' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  try {
    // Check for duplicate email
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ message: 'Email is already registered' });
    }

    // 6-digit verification code and set 10-minute expiry
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);

    // Create user — password is hashed automatically by the pre-save hook
    const user = await User.create({
      name,
      email,
      password,
      verificationCode,
      verificationCodeExpires,
    });

    res.status(201).json({
      message: 'Registration successful. Please check your email for the verification code.',
      userId: user._id,
      verificationCode,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Email is already registered' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { register };
