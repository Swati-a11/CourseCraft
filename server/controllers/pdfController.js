import { GoogleGenerativeAI } from '@google/generative-ai';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const pdfParseLib = require('pdf-parse');
const pdfParse = pdfParseLib.default || pdfParseLib;

export const generatePdfNotes = async (req, res) => {
  try {

    // =========================
    // CHECK FILE
    // =========================
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'PDF file is required',
      });
    }

    // =========================
    // PARSE PDF
    // =========================
    const data = await pdfParse(req.file.buffer);

    const extractedText = data.text;

    if (!extractedText || extractedText.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No text found in PDF',
      });
    }

    // =========================
    // GEMINI AI
    // =========================
    const genAI = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY
    );

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
    });

    // =========================
    // PROMPT
    // =========================
    const prompt = `
You are an AI PDF summarizer.

Analyze the following PDF text and provide:

1. Short Summary
2. Important Key Points
3. Main Topics
4. Easy Notes in Bullet Points

PDF Content:
${extractedText}
`;

    // =========================
    // GENERATE RESPONSE
    // =========================
    const result = await model.generateContent(prompt);

    const response = await result.response;

    const summary = response.text();

    // =========================
    // SEND RESPONSE
    // =========================
    res.status(200).json({
      success: true,
      summary,
    });

  } catch (error) {

    console.error('PDF NOTES ERROR:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to generate PDF notes',
    });
  }
};