import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
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

    topicId: Number,

    notesCompleted: {
      type: Boolean,
      default: false,
    },

    videoCompleted: {
      type: Boolean,
      default: false,
    },

    quizCompleted: {
      type: Boolean,
      default: false,
    },

    quizScore: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Progress", progressSchema);