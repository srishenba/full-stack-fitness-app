import mongoose from 'mongoose';

const StepSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  steps: { type: Number, required: true },
  date: { type: String, required: true }
});

const Step = mongoose.model('Step', StepSchema);
export default Step;
