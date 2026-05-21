import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // ONE progress per user
    },

    topicId: {
      type: String,
      default: '',
    },

    completedTopics: {
      type: [String],
      default: [],
    },

    enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
      },
    ],

    progressPercentage: {
      type: Number,
      default: 0,
    },

    notesCompleted: {
      type: Boolean,
      default: false,
    },

    videoCompleted: {
      type: Boolean,
      default: false,
    },

    quizPassed: {
      type: Boolean,
      default: false,
    },

    quizAttempted: {
      type: Boolean,
      default: false,
    },

    score: {
      type: Number,
      default: 0,
    },

    lastVisitedTopic: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const Progress = mongoose.model('Progress', progressSchema);
export default Progress;