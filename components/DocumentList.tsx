
import React from 'react';
import { ProcessedDocument } from '../types';

interface DocumentListProps {
  documents: ProcessedDocument[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
}

export const DocumentList: React.FC<DocumentListProps> = ({ 
  documents, 
  selectedId, 
  onSelect, 
  onRemove 
}) => {
  if (documents.length === 0) return null;

  const processingCount = documents.filter(d => d.status === 'processing').length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Documents ({documents.length})
        </h3>
        {processingCount > 0 && (
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 rounded-full">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-tight">
              {processingCount} processing
            </span>
          </div>
        )}
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
        {documents.map((doc) => (
          <div 
            key={doc.id}
            onClick={() => onSelect(doc.id)}
            className={`group relative p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
              selectedId === doc.id 
                ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-100 shadow-sm' 
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            {/* Thumbnail with Status Overlay */}
            <div className="relative w-11 h-11 rounded-lg overflow-hidden flex-shrink-0 border border-slate-100 bg-slate-50">
              <img src={doc.imageUrl} alt={doc.name} className={`w-full h-full object-cover transition-opacity ${doc.status === 'processing' ? 'opacity-40' : 'opacity-100'}`} />
              
              {doc.status === 'processing' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
              )}
              
              {doc.status === 'error' && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-500/10">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-red-600">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold truncate ${selectedId === doc.id ? 'text-blue-900' : 'text-slate-800'}`}>
                {doc.name}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                {doc.status === 'processing' && (
                  <span className="text-[10px] text-blue-600 font-bold uppercase tracking-tight animate-pulse">
                    Parsing...
                  </span>
                )}
                {doc.status === 'completed' && (
                  <div className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-emerald-500">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                    <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-tight">Ready</span>
                  </div>
                )}
                {doc.status === 'error' && (
                  <span className="text-[10px] text-red-600 font-bold uppercase tracking-tight">Failed</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onRemove(doc.id);
              }}
              className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-slate-100 text-slate-400 hover:text-red-500 transition-all"
              title="Remove document"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
