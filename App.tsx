
import React, { useState, useCallback, useMemo } from 'react';
import { Layout } from './components/Layout';
import { FileUploader } from './components/FileUploader';
import { DocumentList } from './components/DocumentList';
import { MarkdownViewer } from './components/MarkdownViewer';
import { ProcessedDocument, ProcessingOptions } from './types';
import { ocrService } from './services/geminiService';

export default function App() {
  const [documents, setDocuments] = useState<ProcessedDocument[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [options, setOptions] = useState<ProcessingOptions>({
    preserveLayout: true,
    extractTables: true,
    extractMath: true,
    extractCode: true
  });

  const selectedDoc = useMemo(() => 
    documents.find(d => d.id === selectedId), 
    [documents, selectedId]
  );

  // Status calculations
  const processingCount = useMemo(() => documents.filter(d => d.status === 'processing').length, [documents]);
  const completedCount = useMemo(() => documents.filter(d => d.status === 'completed' || d.status === 'error').length, [documents]);
  const totalCount = documents.length;
  const isAnyProcessing = processingCount > 0;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const processFile = useCallback(async (file: File, currentOptions: ProcessingOptions, shouldSelect: boolean) => {
    const id = Math.random().toString(36).substring(7);
    const imageUrl = URL.createObjectURL(file);
    
    const newDoc: ProcessedDocument = {
      id,
      name: file.name,
      imageUrl,
      markdown: '',
      status: 'processing'
    };

    setDocuments(prev => [newDoc, ...prev]);
    
    if (shouldSelect) {
      setSelectedId(id);
    }

    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      
      const base64 = await base64Promise;
      const markdown = await ocrService.processImage(base64, file.type, currentOptions);
      
      setDocuments(prev => prev.map(doc => 
        doc.id === id ? { ...doc, markdown, status: 'completed' } : doc
      ));
    } catch (err: any) {
      setDocuments(prev => prev.map(doc => 
        doc.id === id ? { ...doc, status: 'error', error: err.message } : doc
      ));
    }
  }, []);

  const handleFilesSelected = (files: File[]) => {
    const currentOptions = { ...options };
    files.forEach((file, index) => {
      const shouldSelect = index === 0 && !selectedId;
      processFile(file, currentOptions, shouldSelect);
    });
  };

  const handleDownload = () => {
    if (!selectedDoc || !selectedDoc.markdown) return;
    const blob = new Blob([selectedDoc.markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedDoc.name.split('.')[0]}_extracted.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const removeDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Get Started</h2>
                  <p className="text-slate-500 text-sm mt-1">Configure extraction options and upload your document.</p>
                </div>
              </div>

              {/* Consolidated Processing Status */}
              {isAnyProcessing && (
                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3 space-y-2 animate-in fade-in slide-in-from-top-1">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-blue-700">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping"></span>
                      Processing Queue
                    </span>
                    <span>{completedCount} of {totalCount} files ready</span>
                  </div>
                  <div className="h-1.5 w-full bg-blue-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 transition-all duration-500 ease-out"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
            
            <FileUploader 
              onFilesSelected={handleFilesSelected} 
              options={options}
              setOptions={setOptions}
            />
            
            <div className="pt-2 border-t border-slate-100">
              <DocumentList 
                documents={documents} 
                selectedId={selectedId} 
                onSelect={setSelectedId}
                onRemove={removeDocument}
              />
            </div>
          </div>

          {selectedDoc && (
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Document Source</p>
              <div className="relative group rounded-xl overflow-hidden border border-slate-100 bg-slate-50 aspect-[3/4]">
                <img 
                  src={selectedDoc.imageUrl} 
                  alt={selectedDoc.name} 
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button 
                    onClick={() => window.open(selectedDoc.imageUrl, '_blank')}
                    className="bg-white/90 backdrop-blur p-2 rounded-full text-slate-900 shadow-lg hover:scale-110 transition-transform"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="mt-3">
                <p className="text-sm font-medium text-slate-900 truncate">{selectedDoc.name}</p>
                {selectedDoc.status === 'error' && (
                  <p className="text-xs text-red-500 mt-1 font-medium bg-red-50 p-2 rounded-lg border border-red-100">
                    Error: {selectedDoc.error}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-8 h-[calc(100vh-12rem)] min-h-[500px]">
          <MarkdownViewer 
            markdown={selectedDoc?.markdown || ''} 
            onDownload={handleDownload}
            isLoading={selectedDoc?.status === 'processing' || false}
          />
        </div>
      </div>
    </Layout>
  );
}
