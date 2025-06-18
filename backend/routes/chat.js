const express = require('express');
const { OpenAI } = require('openai');
const embeddingService = require('../services/embeddingService');
const weaviateService = require('../services/weaviateService');

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post('/', async (req, res, next) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    // Embed the question
    const queryEmbedding = await embeddingService.embedQuery(question);

    // Retrieve relevant chunks
    const results = await weaviateService.query({ vector: queryEmbedding }, 3);
    const context = results.map(r => r.chunk).join('\n---\n');

    // Construct prompt
    const prompt = `You are an AI assistant. Use the following context to answer the question. If you don't know, admit it.\n\nContext:\n${context}\n\nQuestion: ${question}`;

    // Call GPT-4 and fallback to GPT-3.5
    let completion;
    try {
      completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: prompt }
        ],
      });
    } catch (e) {
      completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: prompt }
        ],
      });
    }

    const answer = completion.choices[0].message.content.trim();
    res.json({ answer });
  } catch (err) {
    next(err);
  }
});

module.exports = router;