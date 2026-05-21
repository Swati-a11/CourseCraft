import mongoose from 'mongoose';
import Course from './models/Course.js';
import dotenv from 'dotenv';

dotenv.config();

const debug = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const count = await Course.countDocuments();
    console.log(`Total courses in DB: ${count}\n`);
    
    const firstCourse = await Course.findOne().lean();
    if (firstCourse) {
      console.log('First course structure:');
      console.log(`- _id: ${firstCourse._id}`);
      console.log(`- title: ${firstCourse.title}`);
      console.log(`- topics count: ${firstCourse.topics ? firstCourse.topics.length : 'undefined'}`);
      console.log(`- topics type: ${typeof firstCourse.topics}`);
      console.log(`- Full data:`, JSON.stringify(firstCourse, null, 2).substring(0, 1000));
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

debug();
