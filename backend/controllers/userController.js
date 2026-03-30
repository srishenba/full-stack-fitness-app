const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile', error: err.message });
  }
};

exports.aiAnalysis = async (req, res) => {
  try {
    const user = req.body;
    
    // Simulate AI logic based on user data
    const analysis = {
      mealPlan: [
        "High-protein breakfast: Eggs & Avocado",
        "Balanced Lunch: Grilled Chicken with Quinoa",
        "Light Dinner: Baked Salmon with Asparagus"
      ],
      workoutPlan: [
        `Focus: ${user.fitnessGoal === 'weight-loss' ? 'High-Intensity Cardio' : 'Strength Training'}`,
        "Frequency: 4 days per week",
        "Consistency: Minimum 30 min per session"
      ],
      healthTips: [
        `Increase water intake to ${parseFloat(user.waterIntake || 2) + 0.5}L`,
        "Maintain current biological sync status",
        "Optimize sleep for better recovery"
      ]
    };

    // Simulate delay
    setTimeout(() => res.json(analysis), 1500);
  } catch (err) {
    res.status(500).json({ message: 'AI Analysis failed', error: err.message });
  }
};
