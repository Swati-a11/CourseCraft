import mongoose from 'mongoose';

const topicSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      default: '',
    },
    videoUrl: {
      type: String,
      default: '',
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    quiz: [
      {
        question: {
          type: String,
          required: true,
        },
        options: [
          {
            type: String,
            required: true,
          },
        ],
        answer: {
          type: String,
          required: true,
        },
        difficulty: {
          type: String,
          enum: ['Beginner', 'Intermediate', 'Advanced'],
          default: 'Beginner',
        },
      },
    ],
  },
  { _id: false }
);

const courseSchema = new mongoose.Schema(
  {
    shortId: {
      type: Number,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      default: 'General',
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    duration: {
      type: String,
      default: '4 Weeks',
    },
    thumbnail: {
      type: String,
      default: '',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    topics: [topicSchema],
    enrolledStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model('Course', courseSchema);

export default Course;