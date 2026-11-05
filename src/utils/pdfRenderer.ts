import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { PageItem } from '../types';

let workerConfigured = false;

function ensureWorkerConfigured() {
  if (workerConfigured || typeof window === 'undefined') return;
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
    workerConfigured = true;
  } catch (err) {
    console.warn('PDF worker setup warning:', err);
  }
}

export interface PdfParseResult {
  pages: PageItem[];
  pageCount: number;
  thumbnail?: string;
  pdfDocument?: pdfjsLib.PDFDocumentProxy;
}

export async function parsePdfArrayBuffer(
  buffer: ArrayBuffer,
  fileId: string,
  fileName: string,
  onProgress?: (current: number, total: number) => void
): Promise<PdfParseResult> {
  ensureWorkerConfigured();

  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(buffer),
    cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/cmaps/',
    cMapPacked: true,
  });

  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;
  const pages: PageItem[] = [];
  let thumbnail = '';

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const pdfPage = await pdf.getPage(pageNum);
    // Render at scale 2.0 for high resolution print clarity (>= 200-300 dpi equivalent)
    const baseViewport = pdfPage.getViewport({ scale: 1.0 });
    const isLandscape = baseViewport.width > baseViewport.height;
    const renderScale = 2.0;
    const viewport = pdfPage.getViewport({ scale: renderScale });

    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d', { alpha: false });

    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // @ts-expect-error pdfjs typing compatibility
      await pdfPage.render({ canvasContext: ctx, viewport }).promise;
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);

      if (pageNum === 1) {
        thumbnail = dataUrl;
      }

      pages.push({
        id: `${fileId}-pdf-p${pageNum}`,
        fileId,
        fileName,
        fileType: 'pdf',
        pageIndex: pageNum - 1,
        totalInFile: numPages,
        globalIndex: 0,
        aspectRatio: baseViewport.width / baseViewport.height,
        orientation: isLandscape ? 'landscape' : 'portrait',
        renderType: 'canvas',
        dataUrl,
      });
    }

    if (onProgress) {
      onProgress(pageNum, numPages);
    }
  }

  return {
    pages,
    pageCount: numPages,
    thumbnail,
  };
}
