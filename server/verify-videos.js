import mongoose from 'mongoose';
import Course from './models/Course.js';
import dotenv from 'dotenv';

dotenv.config();

const verify = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const courses = await Course.find().lean();
  
  console.log('✅ Courses with their topics:\n');
  for (const course of courses.slice(0, 5)) {
    console.log(`📚 ${course.title}:`);
    if (course.topics && course.topics.length > 0) {
      course.topics.slice(0, 3).forEach((t, i) => {
        const videoId = t.videoUrl ? t.videoUrl.split('/embed/')[1] || 'unknown' : 'none';
        console.log(`  ${i+1}. ${t.title.substring(0, 40)}... => ${videoId}`);
      });
      if (course.topics.length > 3) console.log(`  ... (${course.topics.length - 3} more topics)`);
    } else {
      console.log('  ⚠️ No topics');
    }
  }
  
  process.exit(0);
};

verify();
