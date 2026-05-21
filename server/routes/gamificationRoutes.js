import express from 'express';
import { getGamification } from '../controllers/gamificationController.js';

const router = express.Router();

router.get('/', getGamification);

export default router;