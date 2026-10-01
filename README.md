# Pagewise

Pagewise is a local-first PDF search and document intelligence application built with React, PDF.js, and browser-side embeddings. The app lets users upload a PDF, extract its text client-side, split the content into overlapping semantic chunks, generate embeddings locally, and run vector similarity search against the stored document index.

## What this project does

- Upload and render a PDF directly in the browser
- Extract text from each page using pdf.js
- Chunk document text into overlapping passage windows
- Generate embeddings with Xenova/all-MiniLM-L6-v2
- Store chunk vectors locally in IndexedDB
- Query the stored index using semantic similarity
- Rank results by relevance and navigate to the best matching page/chunk
- Highlight the selected match within the PDF viewer

## Tech Stack

- React + Vite
- react-pdf
- pdfjs-dist
- @huggingface/transformers
- IndexedDB via idb
- Web Workers
- Tailwind CSS

## Architecture

```text
PDF upload
  ↓
PDF.js text extraction
  ↓
Chunking + overlap management
  ↓
Embedding generation in Web Worker
  ↓
IndexedDB persistence
  ↓
Semantic query embedding + similarity search
  ↓
Result ranking + highlight navigation
```

## Core Components

### Reader UI
The main reading experience lives in `src/pages/ReaderPage.jsx`. It handles document loading, page rendering, query input, result selection, zoom controls, and search-driven PDF navigation.

### Chunking
`src/utils/chunker.js` splits the extracted document text into overlapping chunks for retrieval. The current implementation uses a smaller chunk configuration to improve semantic matching quality and reduce noise.

### Embeddings
`src/utils/embedder.js` initializes a local transformer model and generates embeddings for each chunk from the document. The vectors are normalized and used for similarity scoring.

### Worker Offloading
Heavy ML work is delegated to a Web Worker in `src/worker/embedworker.js` to keep the main thread responsive during indexing and search computation.

### Local Storage
`src/utils/indexedDB.js` persists chunk metadata and embeddings inside IndexedDB so the document index survives browser sessions and supports offline retrieval on the client.

## Search and Retrieval Flow

The system follows a retrieval-first architecture:

```text
Query text
  ↓
Query embedding generation
  ↓
IndexedDB chunk retrieval
  ↓
Dot-product / cosine similarity scoring
  ↓
Top-k ranking
  ↓
Result selection + page navigation + highlight
```

This keeps the search grounded in actual document chunks instead of raw keyword matching alone.

## Performance Snapshot

The application was profiled in Chrome DevTools on large document workloads. In a recorded 95-page technical PDF run, browser-side extraction, chunking, and embedding completed in approximately 168.8 seconds while the browser main thread was active for only about 10.3 seconds, indicating roughly 93.9% idle time during heavy client-side processing.

For retrieval itself, the measured local query execution time was approximately 53.4 ms total: around 33.5 ms for IndexedDB reads and 10.6 ms for similarity scoring. These timings reflect the local, browser-first design of the current system.

## Local Setup

```bash
cd frontend
npm install
npm run dev
```

Then open the app, upload a PDF, and wait for indexing to finish before searching.

## Notes

This project is built as a retrieval-focused document intelligence system rather than a full LLM chat application. The emphasis is on semantic document search, local indexing, source-grounded result navigation, and browser-side performance optimization.
