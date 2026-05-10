import User from "../models/User.js";
import Step from "../models/Step.js";
import Meal from "../models/Meal.js";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});



// ✅ GET PROFILE
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile", error: err.message });
  }
};

// ✅ AI ANALYSIS
export const aiAnalysis = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    const steps = await Step.find({ userId: req.user })
      .sort({ date: -1 })
      .limit(7);

    const prompt = `
You are a world-class AI Fitness Coach.

Return ONLY JSON. No explanation.

{
  "summary": "",
  "keyInsights": ["", ""],
  "recommendations": ["", ""],
  "alerts": [""],
  "dailyPlan": ["", "", ""]
}

User Profile:
Name: ${user.name}
Weight: ${user.weight}
Goal: ${user.fitnessGoal}
Target: ${user.targetWeight}

Steps:
${steps.map(s => `${s.date}: ${s.steps}`).join("\n")}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const aiText = response.choices?.[0]?.message?.content || "";

    console.log("🤖 AI RAW:", aiText);

    let parsed;

    try {
      parsed = JSON.parse(aiText);
    } catch {
      parsed = {
        summary: aiText,
        keyInsights: ["Parsing issue"],
        recommendations: ["Try again"],
        alerts: [],
        dailyPlan: ["Stay active", "Eat healthy", "Sleep well"],
      };
    }

    res.json(parsed);

  } catch (err) {
    console.error("🔥 AI ERROR:", err.message);
    res.status(500).json({ message: "AI Analysis failed", error: err.message });
  }
};

// ✅ SAVE STEPS
export const saveSteps = async (req, res) => {
  try {
    const { date, steps } = req.body;

    let record = await Step.findOne({ userId: req.user, date });

    if (record) {
      record.steps = steps;
      await record.save();
    } else {
      record = new Step({ userId: req.user, date, steps });
      await record.save();
    }

    res.json({ message: "Steps saved", record });
  } catch (err) {
    res.status(500).json({ message: "Error saving steps", error: err.message });
  }
};

// ✅ GET STEPS
export const getSteps = async (req, res) => {
  try {
    const steps = await Step.find({ userId: req.user }).sort({ date: -1 });
    res.json(steps);
  } catch (err) {
    res.status(500).json({ message: "Error fetching steps", error: err.message });
  }
};

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user?.id || req.user;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Dashboard error" });
  }
};

// ✅ UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id || req.user;
    const updates = req.body;

    // Don't allow password update here for security (use a separate route)
    delete updates.password;
    delete updates.email;

    const user = await User.findByIdAndUpdate(userId, updates, { new: true }).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    console.error("Update Profile Error:", err);
    res.status(500).json({ message: "Error updating profile", error: err.message });
  }
};

// ✅ UPDATE FCM TOKEN
export const updateFcmToken = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: "No token provided" });

    await User.findByIdAndUpdate(req.user, { fcmToken: token });

    res.json({ message: "FCM Token updated" });
  } catch (err) {
    res.status(500).json({ message: "Error updating token", error: err.message });
  }
};

// ✅ ADD MEAL
export const addMeal = async (req, res) => {
  try {
    const { foodName, mealType, quantity, calories, protein, carbs, fat, time, date } = req.body;
    const meal = new Meal({
      userId: req.user?.id || req.user,
      foodName,
      mealType,
      quantity,
      calories,
      protein,
      carbs,
      fat,
      time,
      date: date || new Date().toISOString().split('T')[0]
    });
    await meal.save();
    res.status(201).json({ message: "Meal logged successfully", meal });
  } catch (err) {
    res.status(500).json({ message: "Error logging meal", error: err.message });
  }
};

// ✅ GET TODAY'S MEALS
export const getTodaysMeals = async (req, res) => {
  try {
    const date = new Date().toISOString().split('T')[0];
    const meals = await Meal.find({ userId: req.user?.id || req.user, date });
    res.json(meals);
  } catch (err) {
    res.status(500).json({ message: "Error fetching meals", error: err.message });
  }
};

// ✅ GET PROGRESS
export const getProgress = async (req, res) => {
  try {
    const userId = req.user?.id || req.user;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const steps = await Step.find({ userId, date: { $gte: sevenDaysAgo.toISOString().split('T')[0] } });
    const meals = await Meal.find({ userId, createdAt: { $gte: sevenDaysAgo } });

    // Calculate calories and completion
    const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);
    const avgCalories = meals.length > 0 ? Math.round(totalCalories / meals.length) : 0;
    
    res.json({
      weeklySteps: steps,
      weeklyMeals: meals,
      avgCalories,
      goalCompletion: 75 // Placeholder for now
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching progress", error: err.message });
  }
};