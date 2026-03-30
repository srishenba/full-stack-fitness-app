const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  try {
    console.log('--- Signup Request Received ---');
    console.log('Body:', req.body);
    
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
      return res.status(400).json({ success: false, message: 'Missing required fields: Name, Email, or Password' });
    }

    // Check MongoDB Connection
    if (mongoose.connection.readyState !== 1) {
      console.error('MongoDB still connecting or disconnected!');
      return res.status(500).json({ success: false, message: 'Database connecting, please try again.' });
    }

    // Check if User Exists
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'This email is already registered.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Get files (Multer) if any (now optional since user might send JSON)
    const profilePhoto = req.files && req.files['profilePhoto'] ? req.files['profilePhoto'][0].path.replace(/\\/g, '/') : '';
    const sugarReportFile = req.files && req.files['sugarReportFile'] ? req.files['sugarReportFile'][0].path.replace(/\\/g, '/') : '';
    const bloodPressureReport = req.files && req.files['bloodPressureReport'] ? req.files['bloodPressureReport'][0].path.replace(/\\/g, '/') : '';
    const cholesterolReport = req.files && req.files['cholesterolReport'] ? req.files['cholesterolReport'][0].path.replace(/\\/g, '/') : '';

    const newUser = new User({
      name, email: normalizedEmail, password: hashedPassword, age, gender, height, weight, profilePhoto,
      sugarLevel, diabetes, sugarReportFile, bloodPressure, bloodPressureReport, cholesterolLevel, cholesterolReport, allergies, medicalConditions,
      activityLevel, waterIntake, sleepHours, stressLevel,
      foodType, favoriteFoods, foodsToAvoid,
      fitnessGoal, mealFrequency, workoutPreference, targetWeight
    });

    await newUser.save();
    console.log('User saved successfully');

    // Create Token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET || 'mealmove_default_secret', { expiresIn: '7d' });

    res.status(201).json({ 
      success: true, 
      message: "User created successfully",
      token, 
      user: { name, email: normalizedEmail, userId: newUser._id } 
    });
  } catch (err) {
    console.error('Signup Controller Error:', err);
    res.status(400).json({ success: false, message: err.message || 'Error occurred during signup' });
  }
};

exports.signin = async (req, res) => {
  try {
    console.log('--- Signin Request Received ---');
    const { email, password } = req.body;

    // Validate Input
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      console.log('Signin failed: User not found');
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Signin failed: Incorrect password');
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Create Token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'mealmove_default_secret', { expiresIn: '7d' });

    console.log('Signin successful for:', normalizedEmail);
    res.json({ 
      success: true,
      token, 
      user: { name: user.name, email: user.email, userId: user._id } 
    });
  } catch (err) {
    console.error('Signin Controller Error:', err);
    res.status(500).json({ success: false, message: 'Something went wrong. Please try again.', error: err.message });
  }
};
