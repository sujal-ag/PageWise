import { pipeline } from '@huggingface/transformers';

export const embedText = async (chunks) => {
    // Initialise the embedding pipeline
    const pipe = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

    // Generate embeddings for each chunk
    const embeddedChunks = [];
    for (const chunk of chunks) {
      const result = await pipe(chunk.text, { pooling: 'mean', normalize: true });
      embeddedChunks.push({
        text: chunk.text,
        pageNumber: chunk.page,
        embedding: Array.from(result.data)
      });
    }
    return embeddedChunks;
}