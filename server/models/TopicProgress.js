import mongoose from 'mongoose';

const topicProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      default: null,
    },

    topicId: {
      type: String,
      required: true,
    },

    topicTitle: {
      type: String,
      default: '',
    },

    completed: {
      type: Boolean,
      default: false,
    },

    quizAttempted: {
      type: Boolean,
      default: false,
    },

    quizPassed: {
      type: Boolean,
      default: false,
    },

    score: {
      type: Number,
      default: 0,
    },

    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// IMPORTANT: one record per user per topic
topicProgressSchema.index({ user: 1, topicId: 1 }, { unique: true });

const TopicProgress = mongoose.model('TopicProgress', topicProgressSchema);

export default TopicProgress;