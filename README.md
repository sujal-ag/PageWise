# Pagewise — Frontend

Pagewise is a lightweight, local-first PDF reader built with React.

The frontend allows users to upload and read PDF documents, extracts their text in the browser, splits the extracted text into overlapping chunks, generates vector embeddings locally using a Hugging Face transformer model, and stores those embeddings in the browser's IndexedDB.

The current implementation focuses on the **document indexing pipeline**. Semantic retrieval/search over the stored embeddings is **not implemented yet** — see [Search / Retrieval](#search--retrieval) below.

## Features

* PDF viewing with `react-pdf`
* PDF text extraction using `pdfjs`
* Page-aware text chunking with overlap to preserve context
* Local embedding generation using `Xenova/all-MiniLM-L6-v2`
* Embedding generation inside a Web Worker (keeps the UI thread free)
* Batch embedding for improved processing
* Local persistence using IndexedDB
* PDF zoom controls
* Keyboard shortcut for opening the search UI (`Ctrl/Cmd + Shift + F`)

---

## Local-First Design

The entire indexing pipeline runs in the browser — no backend or external service required:

```text
PDF → PDF.js → Chunking → Transformer model → Web Worker → IndexedDB
```

This was a deliberate choice, not a shortcut: document text and generated embeddings never leave the browser, there's no per-request cost or API key to manage, and it works offline once the model is cached. For larger-scale production use, the storage/retrieval layer could later be swapped for a managed vector database or backend service — but for this project's scope, local-first keeps things simple and private.

---

## Current Status

```text
PDF → Text extraction → Chunking → Embedding → IndexedDB storage
```

The pipeline above is fully implemented and working. What's missing is retrieval — turning a user's query into results. Details below.

---

## Architecture

### 1. PDF Reader — `src/pages/ReaderPage.jsx`

Loads the uploaded PDF, renders pages, extracts text per page via `pdfjs`, triggers the embedding worker, tracks indexing completion, and hosts the search UI and zoom controls.

```js
const content = await page.getTextContent();
const pageText = content.items.map(item => item.str).join(' ');
```

Extracted text keeps its page number: `[{ page: 1, text: "..." }, ...]`

### 2. Text Chunking — `src/utils/chunker.js`

Splits each page's text into overlapping chunks (`chunkSize = 300` words, `overlap = 50` words). Each chunk: `{ page, text, chunkIndex }`.

### 3. Embedding Generation — `src/utils/embedder.js`

Uses `Xenova/all-MiniLM-L6-v2` via `@huggingface/transformers`. The pipeline is initialized lazily and reused after first load, with `{ pooling: 'mean', normalize: true }` producing normalized vectors. Chunks are embedded in batches of 10. Output: `{ text, pageNumber, chunkIndex, embedding }`.

### 4. Web Worker — `src/worker/embedworker.js`

Embedding is computationally heavy, so it runs off the main thread:

```text
ReaderPage → chunks → Web Worker → embedText() → IndexedDB → { status: 'done' }
```

### 5. IndexedDB Storage — `src/utils/indexedDB.js`

Database `pagewise`, object store `chunks`, keyed by `chunkIndex`. Exposes `saveChunks(chunks)` and `clearChunks()`. Existing chunks are cleared before a new document is indexed.

---

## Search / Retrieval

**Current state:** the search UI is live, and pressing Enter sends `worker.postMessage({ query })` — but `embedworker.js` only handles `{ chunks }` messages right now. The query message has nowhere to go, so no embedding, similarity calculation, ranking, or highlighting happens yet.

**Planned pipeline:**

```text
Search query → Query embedding → Read stored chunk embeddings
             → Cosine similarity (dot product, since vectors are normalized)
             → Rank → Top-K results → Show / highlight in reader
```

Implementation plan:
1. Embed the query using the same model as `embedder.js`.
2. Read stored chunks from IndexedDB.
3. Score each chunk via dot product against the query vector.
4. Sort, take top-K, return `{ id, score, text, meta }`.
5. Render results in the reader; highlighting exact spans (via `pdfjs` text positions) is a follow-up once basic ranked results work.

Retrieval will start on the main thread for simplicity, and can move into the worker later if scale requires it.

---

## Quick Start

```bash
cd frontend
npm install
npm run dev
```

Open the Vite dev URL, go to the Reader page, upload a PDF, and wait for indexing to finish. Search input activates once indexing completes — the retrieval logic behind it is still pending.

---

## Next Steps

* [ ] Query embedding + IndexedDB chunk retrieval
* [ ] Cosine/dot-product similarity + ranking
* [ ] Worker-side query handling
* [ ] Connect results to the Reader UI
* [ ] Highlight / navigate to matching passages
* [ ] Indexing/search progress states
* [ ] Incremental indexing for larger documents