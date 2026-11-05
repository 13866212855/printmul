import * as docx from 'docx-preview';
import { PageItem } from '../types';

export interface DocxParseResult {
  pages: PageItem[];
  pageCount: number;
  thumbnail?: string;
}

export async function parseDocxArrayBuffer(
  buffer: ArrayBuffer,
  fileId: string,
  fileName: string
): Promise<DocxParseResult> {
  // Create an offscreen wrapper to render docx
  const container = document.createElement('div');
  container.className = 'docx-preview-temp-root';
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  container.style.width = '210mm';
  document.body.appendChild(container);

  try {
    await docx.renderAsync(buffer, container, undefined, {
      inWrapper: false,
      breakPages: true,
      ignoreWidth: false,
      ignoreHeight: false,
      experimental: true,
      renderHeaders: true,
      renderFooters: true,
    });

    // In docx-preview, pages are rendered as section.docx or article elements
    const sections = Array.from(container.querySelectorAll<HTMLElement>('section.docx, article.docx, .docx-wrapper > section'));

    const pages: PageItem[] = [];

    if (sections.length > 0) {
      sections.forEach((sec, idx) => {
        pages.push({
          id: `${fileId}-docx-p${idx + 1}`,
          fileId,
          fileName,
          fileType: 'docx',
          pageIndex: idx,
          totalInFile: sections.length,
          globalIndex: 0,
          orientation: 'portrait',
          renderType: 'html',
          htmlContent: sec.outerHTML,
        });
      });
    } else {
      // Fallback: entire rendered content as 1 page
      pages.push({
        id: `${fileId}-docx-p1`,
        fileId,
        fileName,
        fileType: 'docx',
        pageIndex: 0,
        totalInFile: 1,
        globalIndex: 0,
        orientation: 'portrait',
        renderType: 'html',
        htmlContent: container.innerHTML,
      });
    }

    return {
      pages,
      pageCount: pages.length,
    };
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}
