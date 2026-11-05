export type FileType =
  | 'pdf'
  | 'docx'
  | 'xlsx'
  | 'pptx'
  | 'image'
  | 'text'
  | 'unsupported';

export type ImageFit = 'contain' | 'cover' | 'original';

export type MarginType = 'none' | 'narrow' | 'standard';

export type Orientation = 'auto' | 'portrait' | 'landscape';

export interface PageItem {
  id: string;
  fileId: string;
  fileName: string;
  fileType: FileType;
  pageIndex: number; // 0-based
  totalInFile: number;
  globalIndex: number; // 0-based across all files
  aspectRatio?: number; // width / height
  orientation: 'portrait' | 'landscape';
  renderType: 'canvas' | 'image' | 'html' | 'table';
  dataUrl?: string; // For canvas / image renders
  htmlContent?: string; // For text / formatted html
  tableData?: {
    sheetName: string;
    headers: string[];
    rows: (string | number)[][];
    startRow: number;
    totalRows: number;
    pageNum: number;
    totalPages: number;
  };
  slideData?: {
    slideNum: number;
    title: string;
    texts: string[];
    images: string[];
  };
}

export interface PrintFile {
  id: string;
  name: string;
  size: number;
  type: FileType;
  extension: string;
  status: 'queued' | 'parsing' | 'completed' | 'error';
  errorMessage?: string;
  file: File;
  thumbnail?: string;
  pageCount: number;
  pages: PageItem[];
  pageRange: string; // e.g. "1-3, 5" or ""
  selectedPages: number[]; // 1-based indices that will be printed
  imageFit?: ImageFit;
  warningMessage?: string;
}

export interface PrintSettings {
  margin: MarginType;
  orientation: Orientation;
  startEachOnNewPage: boolean;
  showPageNumber: boolean;
  showFileNameHeader: boolean;
  imageFit: ImageFit;
  monospaceText: boolean;
}
