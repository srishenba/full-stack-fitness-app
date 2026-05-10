import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  steps: {
    type: Number,
    required: true
  },
  waterIntake: Number,
  sleepHours: Number,
  workoutDone: Boolean,
  fitnessScore: {
    type: Number,
    required: true
  },
  bmiStatus: String,
  caloriesBurned: Number,
  caloriesConsumed: Number,
  recommendedCalories: Number,
  waterAnalysis: String,
  sleepAnalysis: String,
  activityLevel: String,
  suggestions: [String],
  workoutSuggestions: [String],
  mealSuggestions: {
    breakfast: { name: String, reason: String },
    lunch: { name: String, reason: String },
    dinner: { name: String, reason: String },
    snack: { name: String, reason: String }
  },
  warnings: [String],
  rawResponse: String
}, { timestamps: true });

const Analysis = mongoose.model('Analysis', analysisSchema);
export default Analysis;
