import { pipeline } from '@huggingface/transformers';

let pipe;

export const embedText = async (chunks) => {
  if (!pipe) {
    // try {
    //   pipe = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
    //     device: 'webgpu', dtype: 'q8'
    //   });
    //   console.log('using webgpu')
    // } catch (e) {
    //   console.log('webgpu not available, falling back to cpu')
    //   pipe = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    // }
    pipe = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  const texts = chunks.map(c => c.text);

  let finalResults = [];

  const batchSize = 10;

  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);

    const results = await pipe(batch, {
      pooling: 'mean',
      normalize: true
    });

    finalResults.push(...results);
  }

  return chunks.map((chunk, i) => ({
    text: chunk.text,
    pageNumber: chunk.page,
    chunkIndex: chunk.chunkIndex,
    startTokenIndex: chunk.startTokenIndex ?? 0,
    endTokenIndex: chunk.endTokenIndex ?? 0,
    pageTokenStart: chunk.pageTokenStart ?? chunk.startTokenIndex ?? 0,
    pageTokenEnd: chunk.pageTokenEnd ?? chunk.endTokenIndex ?? 0,
    embedding: Array.from(finalResults[i].data)
  }));
}