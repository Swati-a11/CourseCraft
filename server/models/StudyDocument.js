import mongoose from 'mongoose';

const studyDocumentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true },
  chunks: [{ type: String, required: true }],
  embeddings: { type: [[Number]], default: [] },
}, { timestamps: true });

export default mongoose.model('StudyDocument', studyDocumentSchema);
