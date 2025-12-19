
import React, { useState } from 'react';

interface MarkdownViewerProps {
  markdown: string;
  onDownload: () => void;
  isLoading: boolean;
}

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ 
  markdown, 
  onDownload, 
  isLoading 
}) => {
  const [view, setView] = useState<'preview' | 'raw'>('preview');

  const copyToClipboard = () => {
    navigator.clipboard.writeText(markdown);
    alert("Copied to clipboard!");
  };

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-12 text-slate-400 bg-white border border-slate-200 rounded-2xl">
        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="font-medium">Gemini is parsing your document...</p>
        <p className="text-sm mt-1">Extracting tables, math, and structures</p>
      </div>
    );
  }

  if (!markdown) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-12 text-slate-400 bg-white border border-slate-200 rounded-2xl">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 mb-4 opacity-20">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
        <p className="text-center font-medium">Select a document to see the results</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
        <div className="flex bg-slate-200/50 p-1 rounded-lg">
          <button 
            onClick={() => setView('preview')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${view === 'preview' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Preview
          </button>
          <button 
            onClick={() => setView('raw')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${view === 'raw' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Source
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={copyToClipboard}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
            </svg>
            Copy
          </button>
          <button 
            onClick={onDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M7.5 12L12 16.5m0 0L16.5 12M12 16.5V3" />
            </svg>
            Export .md
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-6">
        {view === 'preview' ? (
          <div className="prose prose-slate max-w-none prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-table:border prose-table:rounded-xl prose-th:bg-slate-50 prose-th:px-4 prose-th:py-2 prose-td:px-4 prose-td:py-2">
            {/* Simple manual markdown rendering for tables and basic blocks if react-markdown isn't available, but we can just use a div with text-content or simple regex for this demo environment */}
            <pre className="whitespace-pre-wrap font-sans text-slate-800 bg-transparent p-0 border-none">
              {markdown}
            </pre>
          </div>
        ) : (
          <div className="mono text-sm leading-relaxed text-slate-600 whitespace-pre bg-slate-50 p-4 rounded-xl border border-slate-100 min-h-full">
            {markdown}
          </div>
        )}
      </div>
    </div>
  );
};
