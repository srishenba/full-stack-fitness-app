import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String, // Format: YYYY-MM-DD
    required: true
  },
  workout: {
    type: Boolean,
    default: false
  },
  water: {
    type: Boolean,
    default: false
  },
  sleep: {
    type: Boolean,
    default: false
  },
  percentage: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Ensure unique goals per user per day
goalSchema.index({ userId: 1, date: 1 }, { unique: true });

const Goal = mongoose.model('Goal', goalSchema);
export default Goal;
