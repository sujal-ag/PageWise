import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useLocation } from 'react-router-dom';
import { ZoomIn, ZoomOut, RotateCcw, ChevronDown } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import { chunkText, clearChunks } from '../utils/index.js';
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
  const [searchState, setSearchState] = useState('idle');
  const [query, setQuery] = useState('');
  const [resultCount, setResultCount] = useState(0);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedResultIndex, setSelectedResultIndex] = useState(0);
  const [showMatches, setShowMatches] = useState(true);
  const [index, setIndex] = useState(false);
  const pageRefs = useRef({});
  const location = useLocation();
  const file = location.state?.uploadedFile;

  useEffect(() => {
    const handleResize = () => setContainerWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'F' && (e.ctrlKey || e.metaKey) && e.shiftKey) {
        e.preventDefault();
        setSearchState((s) => (s === 'open' ? 'idle' : 'open'));
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!worker) return undefined;

    const handleWorkerMessage = (e) => {
      const { type, status, results = [] } = e.data || {};

      if (type === 'indexing' && status === 'done') {
        setIndex(true);
      }

      if (type === 'search') {
        setSearchResults(results);
        setSelectedResultIndex(0);
        setResultCount(results.length);
        setSearchState('results');
      }
    };

    worker.addEventListener('message', handleWorkerMessage);
    return () => worker.removeEventListener('message', handleWorkerMessage);
  }, [worker]);

  const resetPageHighlights = (pageNumber) => {
    const pageElement = pageRefs.current[pageNumber];
    if (!pageElement) return;

    const textLayer = pageElement.querySelector('.react-pdf__Page__textContent');
    if (textLayer) {
      textLayer.style.backgroundColor = '';
      textLayer.style.borderRadius = '';
    }

    const spans = pageElement.querySelectorAll('.react-pdf__Page__textContent span');
    spans.forEach((span) => {
      span.style.backgroundColor = '';
      span.style.boxShadow = '';
      span.style.borderRadius = '';
    });
  };

  const highlightPageMatches = (pageNumber, selectedChunk) => {
    const pageElement = pageRefs.current[pageNumber];
    if (!pageElement || !selectedChunk) return;

    const start = Number(selectedChunk.pageTokenStart ?? selectedChunk.startTokenIndex ?? 0);
    const end = Number(selectedChunk.pageTokenEnd ?? selectedChunk.endTokenIndex ?? start);
    const spans = Array.from(pageElement.querySelectorAll('.react-pdf__Page__textContent span'));

    let runningIndex = 0;

    spans.forEach((span) => {
      const words = (span.textContent || '').trim().split(/\s+/).filter(Boolean);
      const spanStart = runningIndex;
      const spanEnd = runningIndex + words.length;
      const overlaps = start < spanEnd && end >= spanStart;

      span.style.backgroundColor = overlaps ? 'rgba(251, 146, 60, 0.22)' : '';
      span.style.borderRadius = overlaps ? '0.2rem' : '';
      span.style.boxShadow = overlaps ? 'inset 0 0 0 1px rgba(251, 146, 60, 0.75)' : '';

      runningIndex += words.length;
    });
  };

  useEffect(() => {
    Object.keys(pageRefs.current).forEach((pageNumber) => resetPageHighlights(Number(pageNumber)));

    if (!searchResults.length) return;

    const selected = searchResults[selectedResultIndex] || searchResults[0];
    highlightPageMatches(selected.pageNumber, selected);

    const pageIndex = selected.pageNumber - 1;
    const pageElement = document.querySelectorAll('.react-pdf__Page')[pageIndex];
    if (pageElement) {
      pageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [searchResults, selectedResultIndex]);

  const baseWidth = Math.min(containerWidth * 0.92, 800);
  const pageWidth = baseWidth * scale;

  async function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setIndex(false);
    setResultCount(0);
    setSearchResults([]);
    setQuery('');

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    const fullText = [];
    for (let i = 1; i <= numPages; i += 1) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map((item) => item.str).join(' ');
      fullText.push({ page: i, text: pageText });
    }

    const chunks = chunkText(fullText);
    clearChunks();
    worker.postMessage({ chunks });
  }

  const handleSearch = () => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery || !index) return;

    setSearchState('searching');
    setSearchResults([]);
    setResultCount(0);
    worker.postMessage({ query: trimmedQuery });
  };

  if (!file) {
    return (
      <div className="p-10 text-center text-gray-500">
        No PDF found. Please upload a file first.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center bg-gray-50 min-h-screen py-10">
      {searchState === 'open' && (
        <div className="fixed top-30 left-1/2 -translate-x-1/2 z-30 w-[min(90vw,520px)] px-3">
          <div className="bg-white/95 backdrop-blur-md rounded-full shadow-md border border-gray-200 flex items-center gap-2 px-3 py-2">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
                if (e.key === 'Escape') {
                  setSearchState('idle');
                  setQuery('');
                }
              }}
              placeholder={index ? 'Type to search...' : 'Indexing document...'}
              disabled={!index}
              className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
              autoFocus
            />
            <button onClick={() => setSearchState('idle')} className="p-1 hover:text-orange-500 transition-colors">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      )}

      <div className="fixed top-20 z-10 bg-white/90 backdrop-blur-md px-3 py-2 rounded-full shadow-md border border-gray-200 flex items-center gap-3">
        <button
          onClick={() => setSearchState((s) => (s === 'open' ? 'idle' : 'open'))}
          className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors"
        >
          <Search className="w-4 h-4" />
          <span>Search</span>
        </button>

        <div className="w-px h-4 bg-gray-200" />

        <button
          onClick={() => setScale((s) => Math.max(0.5, +(s - 0.1).toFixed(1)))}
          className="p-1 hover:text-orange-500 transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <span className="text-sm font-semibold text-gray-700 min-w-[40px] text-center">
          {Math.round(scale * 100)}%
        </span>

        <button
          onClick={() => setScale((s) => Math.min(2.5, +(s + 0.1).toFixed(1)))}
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

      <div className="mt-24 w-full flex flex-col items-center gap-6 overflow-x-auto">
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          className="flex flex-col items-center gap-4"
        >
          {Array.from(new Array(numPages), (_, index) => (
            <div
              key={`page_${index + 1}`}
              ref={(el) => {
                if (el) pageRefs.current[index + 1] = el;
              }}
              className="shadow-xl rounded-sm overflow-hidden"
            >
              <Page
                pageNumber={index + 1}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                width={pageWidth}
                onRenderSuccess={() => {
                  if (searchResults.length && (searchResults[selectedResultIndex] || searchResults[0]).pageNumber === index + 1) {
                    highlightPageMatches(index + 1, searchResults[selectedResultIndex] || searchResults[0]);
                  }
                }}
              />
            </div>
          ))}
        </Document>
      </div>

      {searchState === 'results' && resultCount > 0 && (
        <div className="fixed bottom-5 right-5 z-20 w-[min(26rem,calc(100vw-2rem))]">
          <div className="bg-white/95 backdrop-blur-md border border-gray-200 shadow-lg rounded-2xl p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-600">Matches</h3>
                <span className="rounded-full bg-orange-100 px-1.5 py-0.5 text-[9px] font-medium text-orange-700">{resultCount}</span>
              </div>
              <button
                type="button"
                onClick={() => setShowMatches((value) => !value)}
                className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                aria-label="Toggle matches"
              >
                <ChevronDown className={`h-4 w-4 transition-transform ${showMatches ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {showMatches && (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {searchResults.map((result, index) => (
                  <button
                    key={`${result.pageNumber}-${result.chunkIndex}`}
                    type="button"
                    onClick={() => {
                      setSelectedResultIndex(index);
                      const pageIndex = result.pageNumber - 1;
                      const pageElement = document.querySelectorAll('.react-pdf__Page')[pageIndex];
                      pageElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                    className={`block w-full text-left rounded-xl border px-2.5 py-2 transition-colors ${index === selectedResultIndex ? 'border-orange-200 bg-orange-50' : 'border-gray-200 bg-gray-50 hover:border-orange-300 hover:bg-orange-50'}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-medium uppercase tracking-wide text-orange-600">
                        Page {result.pageNumber}
                      </span>
                      <span className="text-[9px] text-gray-400">{result.score}</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-700 line-clamp-3">
                      {result.text.slice(0, 120)}{result.text.length > 120 ? '...' : ''}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ReaderPage;