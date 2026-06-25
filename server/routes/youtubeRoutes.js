import express from 'express';
import { generateYoutubeNotes, getPlaylistVideosController } from '../controllers/youtubeController.js';

const router = express.Router();

router.post('/generate-notes', generateYoutubeNotes);
router.post('/playlist', getPlaylistVideosController);

export default router;
