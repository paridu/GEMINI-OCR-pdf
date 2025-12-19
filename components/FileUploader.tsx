
import React, { useCallback } from 'react';
import { ACCEPTED_FILE_TYPES } from '../constants';
import { ProcessingOptions } from '../types';

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
  options: ProcessingOptions;
  setOptions: React.Dispatch<React.SetStateAction<ProcessingOptions>>;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ 
  onFilesSelected, 
  options, 
  setOptions 
}) => {
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFilesSelected(Array.from(e.target.files));
    }
  }, [onFilesSelected]);

  const toggleOption = (key: keyof ProcessingOptions) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
        {(Object.keys(options) as Array<keyof ProcessingOptions>).map((key) => (
          <label key={key} className="flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-white rounded-lg transition-colors">
            <input
              type="checkbox"
              checked={options[key]}
              onChange={() => toggleOption(key)}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
            <span className="text-xs font-medium text-slate-700 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </span>
          </label>
        ))}
      </div>

      <label 
        htmlFor="file-upload"
        className="relative group cursor-pointer block"
      >
        <div className="w-full py-10 px-6 border-2 border-dashed border-slate-300 rounded-2xl bg-white hover:bg-slate-50 hover:border-blue-400 transition-all duration-300 flex flex-col items-center justify-center gap-3 text-center">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <div>
            <p className="text-base font-semibold text-slate-800">Upload document images</p>
            <p className="text-xs text-slate-500 mt-0.5">JPG, PNG, WebP supported</p>
          </div>
        </div>
        <input 
          id="file-upload" 
          type="file" 
          className="hidden" 
          multiple 
          accept={ACCEPTED_FILE_TYPES}
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
};
