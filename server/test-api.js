import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Import models
import User from './models/User.js';
import Course from './models/Course.js';
import WeakTopic from './models/WeakTopic.js';
import CourseProgress from './models/CourseProgress.js';
import { getDashboardStats } from './controllers/dashboardController.js';
import { getProgressData } from './controllers/learningController.js';

dotenv.config({ path: path.resolve('./.env') });

const test = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB");

    const user = await User.findOne();
    if (!user) {
      console.log("No user found");
      process.exit(0);
    }
    console.log("Found user:", user._id);

    // Mock Express Req/Res
    const req = { user: { _id: user._id } };
    const resDashboard = {
      status: (code) => ({
        json: (data) => console.log(`Dashboard Code ${code}:`, data?.message || "Success (too large to print)")
      })
    };

    const resLearning = {
      status: (code) => ({
        json: (data) => console.log(`Learning Code ${code}:`, data?.message || "Success (too large to print)")
      }),
      json: (data) => console.log(`Learning Code 200:`, data?.message || "Success")
    };

    console.log("Testing getDashboardStats...");
    await getDashboardStats(req, resDashboard);

    console.log("Testing getProgressData...");
    await getProgressData(req, resLearning);

  } catch (e) {
    console.error("GLOBAL ERROR:", e);
  } finally {
    process.exit(0);
  }
};

test();
