
export interface ProcessedDocument {
  id: string;
  name: string;
  imageUrl: string;
  markdown: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  error?: string;
}

export interface ProcessingOptions {
  preserveLayout: boolean;
  extractTables: boolean;
  extractMath: boolean;
  extractCode: boolean;
}
