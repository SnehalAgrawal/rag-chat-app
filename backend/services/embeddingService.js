const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function embedTextChunks(chunks, batchSize = 100) {
  const embeddings = [];
  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize);
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: batch,
    });
    for (const data of response.data) {
      embeddings.push(data.embedding);
    }
  }
  return embeddings;
}

async function embedQuery(query) {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: [query],
  });
  return response.data[0].embedding;
}

module.exports = {
  embedTextChunks,
  embedQuery,
};