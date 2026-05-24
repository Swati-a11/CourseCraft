import mongoose from 'mongoose';

const weakTopicSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    topicId: {
      type: Number,
      required: true,
    },
    topicTitle: {
      type: String,
      required: true,
    },
    averageScore: {
      type: Number,
      required: true,
      min: 0,
    },
    aiFeedback: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Needs Review', 'Improving', 'Mastered'],
      default: 'Needs Review',
    },
  },
  {
    timestamps: true,
  }
);

const WeakTopic = mongoose.model('WeakTopic', weakTopicSchema);

export default WeakTopic;
