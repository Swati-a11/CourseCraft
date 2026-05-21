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
    'kotlin': 'https://www.youtube.com/embed/Yqlvsjv-gpc',
    'swift': 'https://www.youtube.com/embed/09lQMGt0GlE',
    
    // Frontend & Web
    'react': 'https://www.youtube.com/embed/Tn6-PIqc4UM',
    'vue': 'https://www.youtube.com/embed/FXpIoQ_rT_c',
    'angular': 'https://www.youtube.com/embed/k5E2AVpwsko',
    'html': 'https://www.youtube.com/embed/UB3IbeQ4ZiA',
    'css': 'https://www.youtube.com/embed/1Rs2ND1S-10',
    'tailwind': 'https://www.youtube.com/embed/lCxcTsOHrjo',
    'bootstrap': 'https://www.youtube.com/embed/gpFL8V_xQnU',
    'webpack': 'https://www.youtube.com/embed/3On5Z85jCXM',
    'babel': 'https://www.youtube.com/embed/42qME4_pools',
    'next.js': 'https://www.youtube.com/embed/Sklc_fQBmcs',
    'next': 'https://www.youtube.com/embed/Sklc_fQBmcs',
    'nuxt': 'https://www.youtube.com/embed/nteDVNqic5c',
    'svelte': 'https://www.youtube.com/embed/UU1CcLwIIXI',
    
    // Backend & Server
    'nodejs': 'https://www.youtube.com/embed/TlB_eWDSMt4',
    'node.js': 'https://www.youtube.com/embed/TlB_eWDSMt4',
    'express': 'https://www.youtube.com/embed/L72fhGm1tfE',
    'fastapi': 'https://www.youtube.com/embed/7t2alSnE2-I',
    'django': 'https://www.youtube.com/embed/rHux0gMZ3Eg',
    'flask': 'https://www.youtube.com/embed/Z1RJmh_OqeE',
    'spring': 'https://www.youtube.com/embed/9SGDpanBqAQ',
    'laravel': 'https://www.youtube.com/embed/ImtZ5yyShrM',
    'asp.net': 'https://www.youtube.com/embed/E3DBN2yyXfM',
    'rails': 'https://www.youtube.com/embed/fmyvWz5TUWg',
    
    // Databases
    'mongodb': 'https://www.youtube.com/embed/ofme2o29ngU',
    'sql': 'https://www.youtube.com/embed/HXV3zeQKqGY',
    'mysql': 'https://www.youtube.com/embed/ER8oKX5myE0',
    'postgres': 'https://www.youtube.com/embed/qw--U4ffCEM',
    'postgresql': 'https://www.youtube.com/embed/qw--U4ffCEM',
    'oracle': 'https://www.youtube.com/embed/rQKKsyeZT7M',
    'redis': 'https://www.youtube.com/embed/OqCK3N6DvxA',
    'firebase': 'https://www.youtube.com/embed/4d-gIPGzmZ4',
    'elasticsearch': 'https://www.youtube.com/embed/Yp8DvCQhNXk',
    
    // DevOps & Tools
    'git': 'https://www.youtube.com/embed/RGOj5yH7evk',
    'docker': 'https://www.youtube.com/embed/3c-iBn73dDE',
    'kubernetes': 'https://www.youtube.com/embed/X48VuDVv0do',
    'jenkins': 'https://www.youtube.com/embed/4XYaA5xN4rI',
    'ci/cd': 'https://www.youtube.com/embed/scEDHp9NPnM',
    'github': 'https://www.youtube.com/embed/RGOj5yH7evk',
    'gitlab': 'https://www.youtube.com/embed/3c-iBn73dDE',
    
    // Concepts & Fundamentals
    'api': 'https://www.youtube.com/embed/SLwpqD8n3d0',
    'rest': 'https://www.youtube.com/embed/SLwpqD8n3d0',
    'rest api': 'https://www.youtube.com/embed/SLwpqD8n3d0',
    'graphql': 'https://www.youtube.com/embed/eIQh02xuVw4',
    'authentication': 'https://www.youtube.com/embed/4-qR-urKchk',
    'oauth': 'https://www.youtube.com/embed/996OiexHze0',
    'jwt': 'https://www.youtube.com/embed/7Q17ubqLfaM',
    'websocket': 'https://www.youtube.com/embed/1BfCnjr_Vjg',
    'microservices': 'https://www.youtube.com/embed/j3XufmvEMiM',
    'mern': 'https://www.youtube.com/embed/0sDCFPZvW5c',
    'mean': 'https://www.youtube.com/embed/j3XufmvEMiM',
    'web development': 'https://www.youtube.com/embed/ysEN5RaKOlE',
    'database': 'https://www.youtube.com/embed/4d5fhL7mZrg',
    'data structure': 'https://www.youtube.com/embed/sVkMVHU5z_s',
    'algorithm': 'https://www.youtube.com/embed/8hly31xqFqc',
    'design pattern': 'https://www.youtube.com/embed/vNHpsC5Gy_M',
    'oop': 'https://www.youtube.com/embed/pTB0EiLXUC8',
    'functional programming': 'https://www.youtube.com/embed/yKfxMKQgqZc',
    'loops': 'https://www.youtube.com/embed/QfzZyH3nwzc',
    'conditional': 'https://www.youtube.com/embed/rZO6ZL86H4U',
    'functions': 'https://www.youtube.com/embed/FOD408a7EBE',
    'methods': 'https://www.youtube.com/embed/FOD408a7EBE',
    'variables': 'https://www.youtube.com/embed/M4Qy3t3PTd8',
    'constants': 'https://www.youtube.com/embed/M4Qy3t3PTd8',
    'data types': 'https://www.youtube.com/embed/ucJzE6AtAzc',
    'string': 'https://www.youtube.com/embed/08PgIGs-5b0',
    'array': 'https://www.youtube.com/embed/RSSU6ML4rsU',
    'object': 'https://www.youtube.com/embed/WCEEOeezqcE',
    'class': 'https://www.youtube.com/embed/pTB0EiLXUC8',
    'inheritance': 'https://www.youtube.com/embed/pTB0EiLXUC8',
    'polymorphism': 'https://www.youtube.com/embed/pTB0EiLXUC8',
    'encapsulation': 'https://www.youtube.com/embed/pTB0EiLXUC8',
    'constructor': 'https://www.youtube.com/embed/gDjk-5XJ5U8',
    'interface': 'https://www.youtube.com/embed/KDiY1u8bDw4',
    'abstract': 'https://www.youtube.com/embed/KDiY1u8bDw4',
    
    // Data Science & AI
    'machine learning': 'https://www.youtube.com/embed/JHzyqZ1ejc0',
    'deep learning': 'https://www.youtube.com/embed/KNGVpX1AKz0',
    'neural network': 'https://www.youtube.com/embed/aircAruvnKk',
    'tensorflow': 'https://www.youtube.com/embed/tPYj3fFJbGo',
    'pytorch': 'https://www.youtube.com/embed/DKuk73tqoLM',
    'pandas': 'https://www.youtube.com/embed/dcqPhpY7tWk',
    'numpy': 'https://www.youtube.com/embed/GB9ByFAIAH4',
    'scikit-learn': 'https://www.youtube.com/embed/0BokH4MzS2w',
    'matplotlib': 'https://www.youtube.com/embed/OZOOLnxlL6M',
    'nlp': 'https://www.youtube.com/embed/X2vAabgKiK0',
    'computer vision': 'https://www.youtube.com/embed/n1l-wAc5ASM',
    'data science': 'https://www.youtube.com/embed/j3cJZkF-tYs',
    'data analysis': 'https://www.youtube.com/embed/dcqPhpY7tWk',
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
  // Using a deterministic hash to ensure same topic always gets same video
  const hash = topicLower.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const genericVideos = [
    'https://www.youtube.com/embed/ysEN5RaKOlE', // Web Development
    'https://www.youtube.com/embed/sVkMVHU5z_s', // Data Structures
    'https://www.youtube.com/embed/8hly31xqFqc', // Algorithms
    'https://www.youtube.com/embed/pTB0EiLXUC8', // OOP
    'https://www.youtube.com/embed/vNHpsC5Gy_M', // Design Patterns
  ];
  
  return genericVideos[hash % genericVideos.length];
};

const regenerateAllVideos = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB. Regenerating all videos...');

    const courses = await Course.find();
    let updatedCount = 0;
    let totalTopics = 0;

    for (const course of courses) {
      let modified = false;
      
      course.topics.forEach((topic) => {
        totalTopics++;
        const newVideoUrl = generateYoutubeUrl(topic.title);
        if (topic.videoUrl !== newVideoUrl) {
          console.log(`  [${course.title}] ${topic.title}: ${topic.videoUrl} → ${newVideoUrl}`);
          topic.videoUrl = newVideoUrl;
          modified = true;
        }
      });

      if (modified) {
        await course.save();
        updatedCount++;
      }
    }

    console.log(`\n✅ Successfully updated ${updatedCount} courses with ${totalTopics} total topics!`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

regenerateAllVideos();
