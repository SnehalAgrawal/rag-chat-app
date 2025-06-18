const pdf = require('pdf-parse');

async function parsePDF(buffer) {
  const data = await pdf(buffer);
  return data.text;
}

function chunkText(text, maxTokens = 500, overlapTokens = 50) {
  const words = text.split(/\s+/);
  const chunks = [];
  for (let start = 0; start < words.length; start += maxTokens - overlapTokens) {
    const chunk = words.slice(start, start + maxTokens).join(' ');
    chunks.push(chunk);
  }
  return chunks;
}

module.exports = { parsePDF, chunkText };