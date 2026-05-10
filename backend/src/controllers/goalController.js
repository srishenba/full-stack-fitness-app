import Goal from '../../models/Goal.js';

export const getTodayGoals = async (req, res) => {
  try {
    const userId = req.user;
    const today = new Date().toISOString().split('T')[0];

    let goals = await Goal.findOne({ userId, date: today });

    if (!goals) {
      goals = new Goal({ userId, date: today });
      await goals.save();
    }

    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch goals" });
  }
};

export const updateGoal = async (req, res) => {
  try {
    const userId = req.user;
    const { task, status } = req.body;
    const today = new Date().toISOString().split('T')[0];

    const goals = await Goal.findOne({ userId, date: today });
    if (!goals) return res.status(404).json({ error: "Goals not found" });

    if (task === 'workout') goals.workout = status;
    if (task === 'water') goals.water = status;
    if (task === 'sleep') goals.sleep = status;

    // Calculate percentage
    const tasks = [goals.workout, goals.water, goals.sleep];
    const completed = tasks.filter(t => t).length;
    goals.percentage = Math.round((completed / tasks.length) * 100);

    await goals.save();
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ error: "Failed to update goal" });
  }
};
