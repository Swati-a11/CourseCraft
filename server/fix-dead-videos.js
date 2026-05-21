import mongoose from 'mongoose';
import Course from './models/Course.js';
import dotenv from 'dotenv';

dotenv.config();

const updateDeadVideos = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB. Fixing dead videos...');

    const courses = await Course.find();
    let updatedCount = 0;

    const deadVideo = 'kqtD5dpn3C0';
    const goodVideo = 'bMknfKXIFA8'; // Reliable FreeCodeCamp React Video

    for (const course of courses) {
      let modified = false;
      
      course.topics.forEach((topic) => {
        if (topic.videoUrl && topic.videoUrl.includes(deadVideo)) {
          topic.videoUrl = topic.videoUrl.replace(deadVideo, goodVideo);
          modified = true;
        }
      });

      if (modified) {
        await course.save();
        updatedCount++;
      }
    }

    console.log(`Successfully fixed dead videos in ${updatedCount} courses!`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updateDeadVideos();
