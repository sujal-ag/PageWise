import { embedText } from "../utils/index.js"

onmessage = async (e) => {
    const embeddings = await embedText(e.data.chunks);
    postMessage(embeddings);
}