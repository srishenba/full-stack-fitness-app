import mongoose from 'mongoose';

const MealSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  foodName: { type: String, required: true },
  mealType: { type: String, required: true }, // Breakfast, Lunch, Dinner, Snack
  quantity: { type: Number, required: true, default: 1 },
  calories: { type: Number, required: true },
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fat: { type: Number, default: 0 },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  time: { type: String }, // Optional: "14:30"
  createdAt: { type: Date, default: Date.now }
});

const Meal = mongoose.model('Meal', MealSchema);
export default Meal;
