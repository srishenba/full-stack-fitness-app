import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  // Basic Information
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  height: { type: Number, required: true },
  weight: { type: Number, required: true },
  profilePhoto: { type: String },

  // Health Information
  sugarLevel: { type: String },
  diabetes: { type: String },
  sugarReportFile: { type: String },
  bloodPressure: { type: String },
  bloodPressureReport: { type: String },
  cholesterolLevel: { type: String },
  cholesterolReport: { type: String },
  allergies: { type: String },
  medicalConditions: { type: String },

  // Lifestyle Details
  activityLevel: { type: String },
  waterIntake: { type: String },
  sleepHours: { type: String },
  stressLevel: { type: String },

  // Food Preferences
  foodType: { type: String },
  favoriteFoods: { type: String },
  foodsToAvoid: { type: String },

  // Fitness Details
  fitnessGoal: { type: String },
  mealFrequency: { type: String },
  workoutPreference: { type: String },
  targetWeight: { type: Number },

  createdAt: { type: Date, default: Date.now },
  fcmToken: { type: String }, // For Push Notifications
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date }
});

const User = mongoose.model('User', UserSchema);
export default User;
