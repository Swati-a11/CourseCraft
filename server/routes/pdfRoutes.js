import express from 'express';
import multer from 'multer';

import {
  generatePdfNotes,
} from '../controllers/pdfController.js';

const router = express.Router();

const upload = multer();

router.post(
  '/generate-notes',
  upload.single('pdf'),
  generatePdfNotes
);

export default router;