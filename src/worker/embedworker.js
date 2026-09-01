import { embedText } from "../utils/index.js"
import { saveChunks } from "../utils/index.js";

onmessage = async (e) => {
    const embeddings = await embedText(e.data.chunks);
    await saveChunks(embeddings);
    postMessage({ status: 'done' });
}