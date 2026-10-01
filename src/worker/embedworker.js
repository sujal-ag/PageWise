import { embedText } from "../utils/index.js"
import { saveChunks, getAllChunks } from "../utils/index.js";

const dotProduct = (a, b) => {
    if (!a || !b || a.length !== b.length) return 0;
    return a.reduce((sum, value, index) => sum + value * b[index], 0);
};

onmessage = async (e) => {
    if (e.data?.chunks) {
        const embeddings = await embedText(e.data.chunks);
        await saveChunks(embeddings);
        postMessage({ type: 'indexing', status: 'done' });
        return;
    }

    if (e.data?.query) {
        const query = e.data.query.trim();
        if (!query) {
            postMessage({ type: 'search', results: [] });
            return;
        }

        const start = performance.now();

        const queryEmbedding = (await embedText([{ text: query, page: 1, chunkIndex: -1 }]))[0]?.embedding || [];

        const dbStart = performance.now();
        const chunks = await getAllChunks();
        const dbElapsed = performance.now() - dbStart;

        const similarityStart = performance.now();
        const results = chunks
            .map((chunk) => ({
                ...chunk,
                score: dotProduct(chunk.embedding || [], queryEmbedding),
            }))
            .filter((chunk) => chunk.score > 0.1)
            .sort((a, b) => b.score - a.score)
            .slice(0, 8)
            .map((chunk) => ({
                text: chunk.text,
                pageNumber: chunk.pageNumber ?? chunk.page,
                chunkIndex: chunk.chunkIndex,
                startTokenIndex: chunk.startTokenIndex ?? chunk.pageTokenStart ?? 0,
                endTokenIndex: chunk.endTokenIndex ?? chunk.pageTokenEnd ?? 0,
                pageTokenStart: chunk.pageTokenStart ?? chunk.startTokenIndex ?? 0,
                pageTokenEnd: chunk.pageTokenEnd ?? chunk.endTokenIndex ?? 0,
                score: Number(chunk.score.toFixed(4)),
            }));
        const similarityElapsed = performance.now() - similarityStart;

        const totalElapsed = performance.now() - start;
        console.log(`Query execution time: ${totalElapsed.toFixed(2)}ms`);
        console.log(`IndexedDB read time: ${dbElapsed.toFixed(2)}ms`);
        console.log(`Similarity scoring time: ${similarityElapsed.toFixed(2)}ms`);

        postMessage({ type: 'search', results });
    }
};