import mongoose from 'mongoose';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// Specific messages requested by user for debugging
const USER_NOT_FOUND_MESSAGE = 'User not found';
const INCORRECT_PASSWORD_MESSAGE = 'Incorrect password';

export const signup = async (req, res) => {
  try {
    console.log('--- [DEBUG] Signup Process Initiated ---');
    console.log('Incoming Data:', { ...req.body, password: '***' });
    
    // Connection Check
    console.log('DB Connection Check: Status =', mongoose.connection.readyState);
    if (mongoose.connection.readyState !== 1) {
      console.error('❌ DB connection not ready during signup');
      return res.status(500).json({ success: false, message: 'Database connecting, please try again.' });
    }

    const { 
      name, email, password, age, gender, height, weight,
      sugarLevel, diabetes, bloodPressure, cholesterolLevel,
      allergies, medicalConditions,
      activityLevel, waterIntake, sleepHours, stressLevel,
      foodType, favoriteFoods, foodsToAvoid,
      fitnessGoal, mealFrequency, workoutPreference, targetWeight
    } = req.body;

    // Validate Input
    if (!name || !email || !password) {
       console.log('❌ Signup failed: Missing required fields');
      return res.status(400).json({ success: false, message: 'Missing required fields: Name, Email, or Password' });
    }

    // Check if User Exists
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    
    if (existingUser) {
      console.log(`❌ Signup failed: Email ${normalizedEmail} already exists`);
      return res.status(400).json({ success: false, message: 'This email is already registered.' });
    }

    // Hash password
    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log('Password hashed successfully');

    const newUser = new User({
      name, email: normalizedEmail, password: hashedPassword, age, gender, height, weight,
      sugarLevel, diabetes, bloodPressure, cholesterolLevel, allergies, medicalConditions,
      activityLevel, waterIntake, sleepHours, stressLevel,
      foodType, favoriteFoods, foodsToAvoid,
      fitnessGoal, mealFrequency, workoutPreference, targetWeight
    });

    await newUser.save();
    console.log('✅ User created and saved successfully:', normalizedEmail);

    // Create Token
    const token = jwt.sign(
  {
    id: newUser._id,      // 🔥 CHANGE HERE
    name: newUser.name
  },
  process.env.JWT_SECRET || 'mealmove_default_secret',
  { expiresIn: '7d' }
);
    res.status(201).json({ 
      success: true, 
      message: "User created successfully",
      token, 
      user: { name, email: normalizedEmail, userId: newUser._id } 
    });
  } catch (err) {
    console.error('🔥 Signup Error Detailed:', err);
    res.status(500).json({ success: false, message: 'Error occurred during signup', error: err.message });
  }
};

export const signin = async (req, res) => {
  try {
    console.log('--- [DEBUG] Login Process Initiated ---');
    const { email, password } = req.body;
    console.log(`Targeting Email: ${email}`);

    // DB Connection Check
    if (mongoose.connection.readyState !== 1) {
      console.error('❌ MongoDB not ready during signin. State:', mongoose.connection.readyState);
      return res.status(500).json({ success: false, message: 'Database connection not ready. Please try again.' });
    }

    if (!email || !password) {
      console.log('❌ Login failed: Missing email or password');
      return res.status(400).json({ success: false, message: INVALID_CREDENTIALS_MESSAGE });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists
    console.log(`Searching DB for: ${normalizedEmail}`);
    const user = await User.findOne({ email: normalizedEmail });
    
    if (!user) {
      console.log(`❌ Login failed: No user found for '${normalizedEmail}'`);
      return res.status(401).json({ success: false, message: USER_NOT_FOUND_MESSAGE });
    }

    console.log('✅ User fetched from DB:', { name: user.name, email: user.email, id: user._id });
    console.log('Validating password match...');
    
    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(`Bcrypt match result: ${isMatch}`);

    if (!isMatch) {
      console.log(`❌ Login failed: Password mismatch for '${normalizedEmail}'`);
      return res.status(401).json({ success: false, message: INCORRECT_PASSWORD_MESSAGE });
    }

    // Create Token
    const jwtSecret = process.env.JWT_SECRET || 'mealmove_default_secret';
  const token = jwt.sign(
  {
    id: user._id,      // 🔥 FIX HERE
    name: user.name
  },
  jwtSecret,
  { expiresIn: '7d' }
);

    console.log('🎉 Login SUCCESS for:', normalizedEmail);
    return res.status(200).json({ 
      success: true,
      token, 
      message: 'Login successful',
      user: { name: user.name, email: user.email, userId: user._id } 
    });
  } catch (err) {
    console.error('🔥 Login Error Detailed:', err);
    return res.status(500).json({ success: false, message: 'Internal server error during login' });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(404).json({ success: false, message: 'If this email exists, a link will be sent' });

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();
    console.log('Reset link generated:', `reset-password/${resetToken}`);

    res.json({ success: true, message: 'Password reset link generated (see console)' });
  } catch (err) {
    console.error('🔥 ForgotPassword Error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired token' });

    user.password = await bcrypt.hash(password, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    res.json({ success: true, message: 'Password reset successfully' });
  } catch (err) {
    console.error('🔥 ResetPassword Error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
