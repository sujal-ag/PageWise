import { pipeline } from '@huggingface/transformers';

let pipe;

export const embedText = async (chunks) => {
  if (!pipe) {
    pipe = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }

  const texts = chunks.map(c => c.text);

  const results = await pipe(texts, {
    pooling: 'mean',
    normalize: true
  });

  return chunks.map((chunk, i) => ({
    text: chunk.text,
    pageNumber: chunk.page,
    chunkIndex: chunk.chunkIndex,
    embedding: Array.from(results[i].data)
  }));
};