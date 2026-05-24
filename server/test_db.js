import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Enrollment from './models/Enrollment.js';
import Course from './models/Course.js';

dotenv.config({ path: path.resolve('./.env') });

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const enrollments = await Enrollment.find().populate("course").lean();
    console.log(JSON.stringify(enrollments, null, 2));

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
