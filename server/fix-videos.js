import mongoose from 'mongoose';
import Course from './models/Course.js';
import dotenv from 'dotenv';

dotenv.config();

// Generate YouTube URL for topic - creates unique URLs based on topic title
const generateYoutubeUrl = (topicTitle) => {
  const youtubeUrls = {
    // Programming Languages
    'javascript': 'https://www.youtube.com/embed/jS4aFq5-91M',
    'python': 'https://www.youtube.com/embed/kqtD5dpn3C0',
    'java': 'https://www.youtube.com/embed/eIrMbAQSU34',
    'c++': 'https://www.youtube.com/embed/vLnPbtZojF8',
    'csharp': 'https://www.youtube.com/embed/GhQdlIFylMc',
    'c#': 'https://www.youtube.com/embed/GhQdlIFylMc',
    'ruby': 'https://www.youtube.com/embed/t_ispmWmdjY',
    'php': 'https://www.youtube.com/embed/OK_JCtrrv-c',
    'golang': 'https://www.youtube.com/embed/YS4sTTuvjEU',
    'rust': 'https://www.youtube.com/embed/MsocPEZBd-M',
    'typescript': 'https://www.youtube.com/embed/d56mHVSLzlk',
    
    // Frontend & Web
    'react': 'https://www.youtube.com/embed/Tn6-PIqc4UM',
    'vue': 'https://www.youtube.com/embed/FXpIoQ_rT_c',
    'angular': 'https://www.youtube.com/embed/k5E2AVpwsko',
    'html': 'https://www.youtube.com/embed/UB3IbeQ4ZiA',
    'css': 'https://www.youtube.com/embed/1Rs2ND1S-10',
    'tailwind': 'https://www.youtube.com/embed/lCxcTsOHrjo',
    'next.js': 'https://www.youtube.com/embed/Sklc_fQBmcs',
    'next': 'https://www.youtube.com/embed/Sklc_fQBmcs',
    
    // Backend & Server
    'nodejs': 'https://www.youtube.com/embed/TlB_eWDSMt4',
    'node.js': 'https://www.youtube.com/embed/TlB_eWDSMt4',
    'express': 'https://www.youtube.com/embed/L72fhGm1tfE',
    'django': 'https://www.youtube.com/embed/rHux0gMZ3Eg',
    'flask': 'https://www.youtube.com/embed/Z1RJmh_OqeE',
    
    // Databases
    'mongodb': 'https://www.youtube.com/embed/ofme2o29ngU',
    'sql': 'https://www.youtube.com/embed/HXV3zeQKqGY',
    'mysql': 'https://www.youtube.com/embed/ER8oKX5myE0',
    'postgres': 'https://www.youtube.com/embed/qw--U4ffCEM',
    'postgresql': 'https://www.youtube.com/embed/qw--U4ffCEM',
    'redis': 'https://www.youtube.com/embed/OqCK3N6DvxA',
    
    // Tools & Concepts
    'git': 'https://www.youtube.com/embed/RGOj5yH7evk',
    'docker': 'https://www.youtube.com/embed/3c-iBn73dDE',
    'api': 'https://www.youtube.com/embed/SLwpqD8n3d0',
    'rest': 'https://www.youtube.com/embed/SLwpqD8n3d0',
    'graphql': 'https://www.youtube.com/embed/eIQh02xuVw4',
    'authentication': 'https://www.youtube.com/embed/4-qR-urKchk',
    'jwt': 'https://www.youtube.com/embed/7Q17ubqLfaM',
    'websocket': 'https://www.youtube.com/embed/1BfCnjr_Vjg',
    'microservices': 'https://www.youtube.com/embed/j3XufmvEMiM',
    'mern': 'https://www.youtube.com/embed/0sDCFPZvW5c',
    'database': 'https://www.youtube.com/embed/4d5fhL7mZrg',
    'data structure': 'https://www.youtube.com/embed/sVkMVHU5z_s',
    'algorithm': 'https://www.youtube.com/embed/8hly31xqFqc',
    'design pattern': 'https://www.youtube.com/embed/vNHpsC5Gy_M',
    'oop': 'https://www.youtube.com/embed/pTB0EiLXUC8',
    'loops': 'https://www.youtube.com/embed/QfzZyH3nwzc',
    'functions': 'https://www.youtube.com/embed/FOD408a7EBE',
    'variables': 'https://www.youtube.com/embed/M4Qy3t3PTd8',
    'data types': 'https://www.youtube.com/embed/ucJzE6AtAzc',
    'string': 'https://www.youtube.com/embed/08PgIGs-5b0',
    'array': 'https://www.youtube.com/embed/RSSU6ML4rsU',
  };

  const topicLower = topicTitle.toLowerCase().trim();
  
  // Try exact match first
  if (youtubeUrls[topicLower]) {
    return youtubeUrls[topicLower];
  }
  
  // Try keyword matching (longest match first for better accuracy)
  const keywords = Object.keys(youtubeUrls).sort((a, b) => b.length - a.length);
  for (const keyword of keywords) {
    if (topicLower.includes(keyword)) {
      return youtubeUrls[keyword];
    }
  }
  
  // If no match found, generate a generic educational video based on topic
  const hash = topicLower.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const genericVideos = [
    'https://www.youtube.com/embed/ysEN5RaKOlE',
    'https://www.youtube.com/embed/sVkMVHU5z_s',
    'https://www.youtube.com/embed/8hly31xqFqc',
    'https://www.youtube.com/embed/pTB0EiLXUC8',
    'https://www.youtube.com/embed/vNHpsC5Gy_M',
  ];
  
  return genericVideos[hash % genericVideos.length];
};

const fixVideos = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB. Fixing videos...');

    const courses = await Course.find();
    let updatedCount = 0;

    for (const course of courses) {
      let modified = false;
      
      course.topics.forEach((topic) => {
        if (!topic.videoUrl || (!topic.videoUrl.includes('youtube.com') && !topic.videoUrl.includes('youtu.be'))) {
          topic.videoUrl = generateYoutubeUrl(topic.title);
          modified = true;
        }
      });

      if (modified) {
        await course.save();
        updatedCount++;
      }
    }

    console.log(`Successfully fixed videos for ${updatedCount} courses!`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixVideos();
