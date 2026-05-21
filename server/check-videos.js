import mongoose from 'mongoose';
import Course from './models/Course.js';
import dotenv from 'dotenv';

dotenv.config();

const checkVideos = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB\n');

    const courses = await Course.find().limit(2).lean();
    
    for (const course of courses) {
      console.log(`📚 Course: ${course.title}`);
      console.log('Topics:');
      course.topics.forEach((topic, i) => {
        console.log(`  ${i + 1}. ${topic.title}`);
        console.log(`     URL: ${topic.videoUrl}`);
      });
      console.log('\n---\n');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

checkVideos();
