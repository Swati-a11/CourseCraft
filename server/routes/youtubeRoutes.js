import express from 'express';
import { generateYoutubeNotes } from '../controllers/youtubeController.js';

const router = express.Router();

router.post('/generate-notes', generateYoutubeNotes);

export default router;
