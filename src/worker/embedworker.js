import { embedText } from "../utils/embedder.js"

onmessage = async (e) => {
    const embeddings = await embedText(e.data.chunks);
    console.log(embeddings);
    postMessage(embeddings);
}