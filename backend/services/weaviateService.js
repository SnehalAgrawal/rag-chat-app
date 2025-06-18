// Import the default export from the Weaviate TypeScript client
const weaviate = require('weaviate-ts-client').default;

const client = weaviate.client({
  scheme: process.env.WEAVIATE_HOST.startsWith('https') ? 'https' : 'http',
  host: process.env.WEAVIATE_HOST.replace(/^https?:\/\//, ''),
  apiKey: process.env.WEAVIATE_API_KEY
    ? new weaviate.ApiKey(process.env.WEAVIATE_API_KEY)
    : undefined,
});

const CLASS_NAME = 'DocumentChunk';

async function ensureSchema() {
  const schema = await client.schema.getter().do();
  const classes = schema.classes.map(c => c.class);
  if (!classes.includes(CLASS_NAME)) {
    await client.schema.classCreator().withClass({
      class: CLASS_NAME,
      description: 'Document chunks for RAG',
      vectorizer: 'none',
      properties: [
        { name: 'chunk', dataType: ['text'] },
      ],
    }).do();
  }
}

async function batchUpsert(chunks, embeddings) {
  await ensureSchema();
  const batcher = client.batch.objectsBatcher();
  for (let i = 0; i < chunks.length; i++) {
    batcher.withObject({
      class: CLASS_NAME,
      properties: {
        chunk: chunks[i],
      },
      vector: embeddings[i],
    });
  }
  return batcher.do();
}

async function query(nearVector, k = 3) {
  const res = await client.graphql.get()
    .withClassName(CLASS_NAME)
    .withFields('chunk _additional { distance }')
    .withNearVector(nearVector)
    .withLimit(k)
    .do();
  const data = res.data.Get[CLASS_NAME];
  return data.map(item => ({
    chunk: item.chunk,
    distance: item._additional.distance,
  }));
}

module.exports = { batchUpsert, query };