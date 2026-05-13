import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useLocation } from 'react-router-dom';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import { chunkText, saveChunks, clearChunks } from '../utils/index.js';
import { Search, X } from 'lucide-react';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

function ReaderPage({ worker }) {
  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(1);
  const [containerWidth, setContainerWidth] = useState(window.innerWidth);
  const [searchState, setSearchState] = useState('open'); // 'idle', 'open', 'searching', 'results'
  const [query, setQuery] = useState('');
  const [resultCount, setResultCount] = useState(0);
  const location = useLocation();
  const file = location.state?.uploadedFile;

  useEffect(() => {
    const handleResize = () => setContainerWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      console.log('key pressed', e.key, e.ctrlKey, e.shiftKey);
      if (e.key === 'f' && (e.ctrlKey || e.metaKey) && e.shiftKey) {
        e.preventDefault();
        setSearchState(s => s === 'open' ? 'idle' : 'open');
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const baseWidth = Math.min(containerWidth * 0.92, 800);
  const pageWidth = baseWidth * scale;

  async function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);

    const arrayBuffer = await file.arrayBuffer();

    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = [];
    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map(item => item.str).join(' ');
      fullText.push({ page: i, text: pageText });
    }

    const chunks = chunkText(fullText);

    clearChunks();

    worker.postMessage({ chunks });

    worker.onmessage = (e) => {
      console.log('Received embeddings from worker:', e.data);
      // You can now use the embeddings (e.data) as needed in your application
      saveChunks(e.data);
    }
  }

  if (!file) {
    return (
      <div className="p-10 text-center text-gray-500">
        No PDF found. Please upload a file first.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center bg-gray-50 min-h-screen py-10">
      {/* Search Bar */}
      {searchState === 'open' && (
        <div className="fixed top-32 left-1/2 -translate-x-1/2 z-20 w-full max-w-xl px-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 flex items-center gap-3 px-4 py-3">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  // search trigger here
                }
                if (e.key === 'Escape') setSearchState('idle');
              }}
              placeholder="Search anything in the document..."
              className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
              autoFocus
            />
            {resultCount > 0 && (
              <span className="text-xs text-gray-400 shrink-0">{resultCount} results</span>
            )}
            <button onClick={() => setSearchState('idle')} className="p-1 hover:text-orange-500 transition-colors">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="fixed top-20 z-10 bg-white/90 backdrop-blur-md px-5 py-2 rounded-full shadow-md border border-gray-200 flex items-center gap-4">
        <button
          onClick={() => setScale(s => Math.max(0.5, +(s - 0.1).toFixed(1)))}
          className="p-1 hover:text-orange-500 transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <span className="text-sm font-semibold text-gray-700 min-w-[40px] text-center">
          {Math.round(scale * 100)}%
        </span>

        <button
          onClick={() => setScale(s => Math.min(2.5, +(s + 0.1).toFixed(1)))}
          className="p-1 hover:text-orange-500 transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <div className="w-px h-4 bg-gray-200" />

        <button
          onClick={() => setScale(1)}
          className="p-1 hover:text-orange-500 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <div className="w-px h-4 bg-gray-200" />

        <span className="text-sm font-bold text-gray-700">
          <span className="text-orange-500">{numPages || '...'}</span> pages
        </span>
      </div>

      {/* PDF */}
      <div className="mt-16 w-full flex flex-col items-center gap-6 overflow-x-auto">
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          className="flex flex-col items-center gap-4"
        >
          {Array.from(new Array(numPages), (_, index) => (
            <div key={`page_${index + 1}`} className="shadow-xl rounded-sm overflow-hidden">
              <Page
                pageNumber={index + 1}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                width={pageWidth}
              />
            </div>
          ))}
        </Document>
      </div>

    </div>
  );
}

export default ReaderPage;