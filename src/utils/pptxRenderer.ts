import JSZip from 'jszip';
import { PageItem } from '../types';

export interface PptxParseResult {
  pages: PageItem[];
  pageCount: number;
  thumbnail?: string;
  warningMessage?: string;
}

export async function parsePptxArrayBuffer(
  buffer: ArrayBuffer,
  fileId: string,
  fileName: string
): Promise<PptxParseResult> {
  const zip = await JSZip.loadAsync(buffer);
  const pages: PageItem[] = [];

  // Find all slide XML files
  const slideFiles = Object.keys(zip.files)
    .filter((name) => /^ppt\/slides\/slide\d+\.xml$/.test(name))
    .sort((a, b) => {
      const numA = parseInt(a.replace(/\D/g, ''), 10);
      const numB = parseInt(b.replace(/\D/g, ''), 10);
      return numA - numB;
    });

  if (slideFiles.length === 0) {
    throw new Error('未在 PPTX 文件中检测到有效的幻灯片数据');
  }

  // Pre-load media images to data URLs
  const mediaMap = new Map<string, string>();
  const mediaFiles = Object.keys(zip.files).filter((name) => name.startsWith('ppt/media/'));
  for (const mFile of mediaFiles) {
    const fileData = zip.file(mFile);
    if (fileData) {
      const blob = await fileData.async('blob');
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
      const simpleName = mFile.replace('ppt/media/', '');
      mediaMap.set(simpleName, dataUrl);
    }
  }

  for (let i = 0; i < slideFiles.length; i++) {
    const slidePath = slideFiles[i];
    const xmlText = await zip.file(slidePath)!.async('text');

    // Simple XML text extractor for text runs
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, 'application/xml');

    // Extract all text paragraphs
    const paragraphs: string[] = [];
    const pElements = doc.getElementsByTagName('a:p');
    for (let pIdx = 0; pIdx < pElements.length; pIdx++) {
      const pEl = pElements[pIdx];
      const tElements = pEl.getElementsByTagName('a:t');
      let lineText = '';
      for (let tIdx = 0; tIdx < tElements.length; tIdx++) {
        lineText += tElements[tIdx].textContent || '';
      }
      const trimmed = lineText.trim();
      if (trimmed) {
        paragraphs.push(trimmed);
      }
    }

    const title = paragraphs[0] || `幻灯片 ${i + 1}`;
    const bodyTexts = paragraphs.slice(1);

    // Look for slide rels to find associated images
    const relsPath = slidePath.replace('ppt/slides/slide', 'ppt/slides/_rels/slide') + '.rels';
    const relsFile = zip.file(relsPath);
    const slideImages: string[] = [];

    if (relsFile) {
      const relsXml = await relsFile.async('text');
      const relsDoc = parser.parseFromString(relsXml, 'application/xml');
      const relTags = relsDoc.getElementsByTagName('Relationship');
      for (let rIdx = 0; rIdx < relTags.length; rIdx++) {
        const target = relTags[rIdx].getAttribute('Target') || '';
        if (target.includes('media/')) {
          const imgName = target.split('/').pop()!;
          if (mediaMap.has(imgName)) {
            slideImages.push(mediaMap.get(imgName)!);
          }
        }
      }
    }

    pages.push({
      id: `${fileId}-pptx-p${i + 1}`,
      fileId,
      fileName,
      fileType: 'pptx',
      pageIndex: i,
      totalInFile: slideFiles.length,
      globalIndex: 0,
      orientation: 'landscape',
      renderType: 'html',
      slideData: {
        slideNum: i + 1,
        title,
        texts: bodyTexts,
        images: slideImages,
      },
    });
  }

  return {
    pages,
    pageCount: pages.length,
    warningMessage:
      'PowerPoint 幻灯片在网页中按图文排版解析。若需100%保留特殊艺术字与转场效果，建议先在 PowerPoint 中另存为 PDF 再上传打印。',
  };
}
