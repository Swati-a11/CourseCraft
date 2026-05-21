import mongoose from "mongoose";

const topicProgressSchema = new mongoose.Schema({
  topicIndex: Number,
  notesCompleted: { type: Boolean, default: false },
  videoCompleted: { type: Boolean, default: false },
  quizAttempted: { type: Boolean, default: false },
  quizPassed: { type: Boolean, default: false },
  quizScore: { type: Number, default: 0 },
  completedAt: { type: Date, default: null },
});

const courseProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    completedTopics: [topicProgressSchema],

    totalProgress: {
      type: Number,
      default: 0,
    },

    isCompleted: {
      type: Boolean,
      default: false,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    lastAccessedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("CourseProgress", courseProgressSchema);