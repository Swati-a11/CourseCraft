import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  goal: { type: String, required: true, maxlength: 300 },
  level: { type: String, required: true, maxlength: 30 },
  duration: { type: Number, required: true, min: 1, max: 90 },
  hoursPerDay: { type: Number, required: true, min: 1, max: 24 },
  content: { type: String, required: true, maxlength: 200000 },
  completedDays: { type: [Number], default: [] },
}, { timestamps: true });
export default mongoose.model('StudyPlan', schema);
