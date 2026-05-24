import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Import models
import User from './server/models/User.js';
import WeakTopic from './server/models/WeakTopic.js';
import CourseProgress from './server/models/CourseProgress.js';

dotenv.config({ path: path.resolve('./server/.env') });

const test = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB");

    const user = await User.findOne();
    console.log("Found user:", user?._id);

    if (user) {
      const weakTopics = await WeakTopic.find({ user: user._id });
      console.log("Weak topics query success", weakTopics);

      const progresses = await CourseProgress.find({ user: user._id }).populate('course', 'title');
      console.log("CourseProgress query success", progresses.length);
    }

  } catch (e) {
    console.error("ERROR:", e.message);
  } finally {
    process.exit(0);
  }
};

test();
