import { PDFDocument } from 'pdf-lib';
import { PageItem } from '../types';

// A4 dimensions in PDF points (72 points per inch; 210mm = 595.28 pt, 297mm = 841.89 pt)
const A4_PORTRAIT_WIDTH = 595.28;
const A4_PORTRAIT_HEIGHT = 841.89;

/**
 * Merges pages into a unified A4 PDF document and triggers browser download
 */
export async function exportMergedPdf(
  pages: PageItem[],
  outputName = 'A4_一键批量打印合并文档.pdf',
  onProgress?: (current: number, total: number) => void
): Promise<void> {
  const mergedPdf = await PDFDocument.create();

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const isLandscape = page.orientation === 'landscape';
    const pageWidth = isLandscape ? A4_PORTRAIT_HEIGHT : A4_PORTRAIT_WIDTH;
    const pageHeight = isLandscape ? A4_PORTRAIT_WIDTH : A4_PORTRAIT_HEIGHT;

    const pdfPage = mergedPdf.addPage([pageWidth, pageHeight]);

    // If page has a dataUrl (PDF canvas, image)
    if (page.dataUrl) {
      try {
        const isPng = page.dataUrl.startsWith('data:image/png');
        const imgBytes = await fetch(page.dataUrl).then((res) => res.arrayBuffer());
        const embeddedImg = isPng
          ? await mergedPdf.embedPng(imgBytes)
          : await mergedPdf.embedJpg(imgBytes);

        const imgDims = embeddedImg.scale(1.0);
        // Fit within page margins (standard ~34pt / 12mm)
        const margin = 20;
        const availWidth = pageWidth - margin * 2;
        const availHeight = pageHeight - margin * 2;

        const scale = Math.min(availWidth / imgDims.width, availHeight / imgDims.height);
        const drawWidth = imgDims.width * scale;
        const drawHeight = imgDims.height * scale;
        const x = (pageWidth - drawWidth) / 2;
        const y = (pageHeight - drawHeight) / 2;

        pdfPage.drawImage(embeddedImg, {
          x,
          y,
          width: drawWidth,
          height: drawHeight,
        });
      } catch (err) {
        console.error('Failed to embed image into merged PDF:', err);
      }
    } else {
      // For text or table pages without pre-rendered dataUrl, draw page outline and content info
      pdfPage.drawRectangle({
        x: 20,
        y: 20,
        width: pageWidth - 40,
        height: pageHeight - 40,
        borderWidth: 0.5,
        opacity: 0.1,
      });
    }

    if (onProgress) {
      onProgress(i + 1, pages.length);
    }
  }

  const pdfBytes = await mergedPdf.save();
  const blob = new Blob([pdfBytes as Uint8Array<ArrayBuffer>], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = outputName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
