import openai from "../config/openai.js";
import User from "../../models/User.js";
import Meal from "../../models/Meal.js";
import Analysis from "../../models/Analysis.js";

const delay = (ms) => new Promise(res => setTimeout(res, ms));

// 🔁 Retry wrapper (handles rate limits / server issues)
const generateWithRetry = async (messages, retries = 3) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    return response;

  } catch (err) {
    if (
      retries > 0 &&
      (err.status === 429 || err.status >= 500)
    ) {
      console.log("OpenAI busy... retrying");
      await delay(2000);
      return generateWithRetry(messages, retries - 1);
    }

    throw err;
  }
};

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    // ✅ Validate input
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // ✅ Convert your prompt into OpenAI message format
    const messages = [
      {
        role: "system",
        content: `You are "Antigravity AI", a smart assistant built into a modern web application.

Your purpose is to help users instantly with clear, useful, and practical answers.

Instructions:
- Keep responses short and easy to understand
- Be friendly, confident, and professional
- For technical questions, explain step-by-step
- For general questions, give simple and direct answers
- Use bullet points when helpful
- Give real-world examples if needed
- Avoid unnecessary long explanations
- If the query is unclear, make a reasonable assumption and respond helpfully`,
      },
      {
        role: "user",
        content: message,
      },
    ];

    // ✅ Call OpenAI with retry
    const result = await generateWithRetry(messages);

    // ✅ Extract response safely
    const reply = result.choices[0].message.content;

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("🔥 OpenAI Error:", error);

    return res.status(500).json({
      error: "AI service is busy. Please try again.",
    });
  }
};

export const generateFitnessAnalysis = async (req, res) => {
  try {
    const { steps, waterIntake, sleepHours, workoutDone } = req.body;
    const userId = req.user;

    if (steps === undefined || steps === null) {
      return res.status(400).json({ error: "Today's steps are required" });
    }

    // 1. Fetch User Data
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // 2. Fetch Today's Meals
    const today = new Date().toISOString().split('T')[0];
    const meals = await Meal.find({ userId, date: today });
    const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);

    let analysisData;
    let rawResponse = "Local Fallback Generation";

    try {
      // 3. Prepare AI Prompt
      const prompt = `
        Analyze this user's fitness data and provide a personalized report + meal plan.
        User Profile:
        - Name: ${user.name}, Age: ${user.age}, Weight: ${user.weight}kg, Height: ${user.height}cm
        - Goal: ${user.fitnessGoal || 'General Fitness'}
        - Today's Activity: Steps: ${steps}, Water: ${waterIntake || 0}L, Sleep: ${sleepHours || 0}h, Workout: ${workoutDone ? 'Yes' : 'No'}
        - Nutrition: ${totalCalories}kcal consumed.
        
        Return ONLY JSON:
        {
          "fitnessScore": number, "bmiStatus": "string", "caloriesBurned": number,
          "recommendedCalories": number (target intake),
          "waterAnalysis": "string", "sleepAnalysis": "string", "activityLevel": "string",
          "suggestions": ["string"], "workoutSuggestions": ["string"], "warnings": ["string"],
          "mealSuggestions": {
            "breakfast": { "name": "string", "reason": "string" },
            "lunch": { "name": "string", "reason": "string" },
            "dinner": { "name": "string", "reason": "string" },
            "snack": { "name": "string", "reason": "string" }
          }
        }
      `;

      const result = await generateWithRetry([
        { role: "system", content: "You are a professional AI Fitness & Nutrition Coach. Return ONLY JSON." },
        { role: "user", content: prompt }
      ]);

      const content = result.choices[0].message.content;
      rawResponse = content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      analysisData = JSON.parse(jsonMatch ? jsonMatch[0] : content);

    } catch (aiErr) {
      console.error("AI Generation Error, Using Fallback Logic:", aiErr);
      
      // BACKEND FALLBACK LOGIC
      const heightInM = user.height / 100;
      const bmi = user.weight / (heightInM * heightInM);
      let bmiStatus = "Normal";
      if (bmi < 18.5) bmiStatus = "Underweight";
      else if (bmi > 25) bmiStatus = "Overweight";

      analysisData = {
        fitnessScore: 75,
        bmiStatus,
        caloriesBurned: Math.round(steps * 0.04 + (workoutDone ? 300 : 0)),
        recommendedCalories: user.fitnessGoal === 'Weight Loss' ? 1800 : 2500,
        waterAnalysis: "Maintain hydration.",
        sleepAnalysis: "Rest is key.",
        activityLevel: steps > 8000 ? "Highly Active" : "Moderately Active",
        suggestions: ["Maintain a balanced diet"],
        workoutSuggestions: ["Stay consistent"],
        warnings: [],
        mealSuggestions: {
          breakfast: { name: "Oats with Nuts", reason: "Sustained energy" },
          lunch: { name: "Grilled Chicken Salad", reason: "Lean protein" },
          dinner: { name: "Quinoa and Veggies", reason: "Light recovery" },
          snack: { name: "Greek Yogurt", reason: "Protein boost" }
        }
      };
    }

    // 4. Save to Database
    const newAnalysis = new Analysis({
      userId,
      steps,
      waterIntake,
      sleepHours,
      workoutDone,
      caloriesConsumed: totalCalories,
      ...analysisData,
      rawResponse
    });

    await newAnalysis.save();

    return res.status(200).json({ 
      success: true, 
      analysis: newAnalysis 
    });

  } catch (error) {
    console.error("Critical Analysis Error:", error);
    return res.status(500).json({ error: "Internal server error during analysis" });
  }
};

export const getAnalysisHistory = async (req, res) => {
  try {
    const history = await Analysis.find({ userId: req.user })
      .sort({ date: -1 })
      .limit(10);
    return res.status(200).json(history);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch history" });
  }
};

export const detectNutrition = async (req, res) => {
  try {
    const { foodName, quantity } = req.body;
    if (!foodName) return res.status(400).json({ error: "Food name is required" });

    // Clean food name
    const cleanFood = foodName.trim().toLowerCase();

    const prompt = `
      As a nutrition expert, estimate values for: ${quantity || 1} serving(s) of "${cleanFood}".
      This might be a combined meal (e.g. "Idly with sambar"). Analyze all components.
      
      Return ONLY a JSON object:
      {
        "calories": number,
        "protein": number,
        "carbs": number,
        "fat": number,
        "isEstimate": true
      }
    `;

    const result = await generateWithRetry([
      { role: "system", content: "You are a professional nutritionist. Always return valid JSON." },
      { role: "user", content: prompt }
    ]);

    let nutrition;
    try {
      const content = result.choices[0].message.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      nutrition = JSON.parse(jsonMatch ? jsonMatch[0] : content);
    } catch (parseErr) {
      console.error("AI JSON Parse Error:", parseErr);
      // Backend Fallback 1: Generic estimate if parsing fails
      nutrition = {
        calories: 250,
        protein: 8,
        carbs: 35,
        fat: 6,
        isEstimate: true,
        note: "Estimated fallback"
      };
    }

    return res.status(200).json(nutrition);

  } catch (error) {
    console.error("Nutrition detection error:", error);
    // Backend Fallback 2: Safe response on API failure
    return res.status(200).json({
      calories: 200,
      protein: 5,
      carbs: 30,
      fat: 4,
      isEstimate: true,
      error: "API timeout, using approximate values"
    });
  }
};