const express = require('express');
const multer = require('multer');
const pdfParser = require('../utils/pdfParser');
const embeddingService = require('../services/embeddingService');
const weaviateService = require('../services/weaviateService');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const text = await pdfParser.parsePDF(req.file.buffer);
    const chunks = pdfParser.chunkText(text, 500, 50);

    const embeddings = await embeddingService.embedTextChunks(chunks);
    await weaviateService.batchUpsert(chunks, embeddings);

    res.json({ message: 'File processed and data indexed', chunks: chunks.length });
  } catch (err) {
    next(err);
  }
});

module.exports = router;