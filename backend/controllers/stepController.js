import Step from '../models/Step.js';

export const saveSteps = async (req, res) => {
  try {
    const { userId, steps, date } = req.body;
    
    if (!userId || steps === undefined || !date) {
      return res.status(400).json({ message: 'Missing userId, steps, or date' });
    }

    const stepRecord = await Step.findOneAndUpdate(
      { userId, date },
      { steps },
      { new: true, upsert: true }
    );
    
    res.status(200).json({ message: 'Steps saved successfully', stepRecord });
  } catch (err) {
    res.status(500).json({ message: 'Error saving steps', error: err.message });
  }
};

export const getStepsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ message: 'Missing userId' });

    const steps = await Step.find({ userId }).sort({ date: -1 });
    res.status(200).json(steps);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching steps', error: err.message });
  }
};

export const getTodaySteps = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ message: 'Missing userId' });

    const today = new Date().toISOString().split('T')[0];
    const todayRecord = await Step.findOne({ userId, date: today });
    
    res.status(200).json({ steps: todayRecord ? todayRecord.steps : 0, date: today });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching today steps', error: err.message });
  }
};
