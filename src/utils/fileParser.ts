import { PrintFile } from '../types';
import { detectFileType } from './fileType';
import { parseImageFile } from './imageRenderer';
import { parsePdfArrayBuffer } from './pdfRenderer';
import { parseExcelArrayBuffer } from './excelRenderer';
import { parseDocxArrayBuffer } from './docxRenderer';
import { parsePptxArrayBuffer } from './pptxRenderer';
import { parseTextContent } from './textRenderer';

export async function parseFile(
  file: File,
  onProgress?: (percent: number) => void
): Promise<PrintFile> {
  const fileId = 'file_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();
  const fileInfo = detectFileType(file.name, file.type);

  const baseFile: PrintFile = {
    id: fileId,
    name: file.name,
    size: file.size,
    type: fileInfo.type,
    extension: fileInfo.extension,
    status: 'parsing',
    file,
    pageCount: 0,
    pages: [],
    pageRange: '',
    selectedPages: [],
  };

  // If unsupported format
  if (!fileInfo.isSupported) {
    baseFile.status = 'error';
    baseFile.errorMessage = fileInfo.advice || '该文件格式暂不支持浏览器直接解析。';
    return baseFile;
  }

  try {
    if (fileInfo.type === 'image') {
      const { pages, pageCount, thumbnail } = await parseImageFile(file, fileId);
      baseFile.pages = pages;
      baseFile.pageCount = pageCount;
      baseFile.thumbnail = thumbnail;
      baseFile.selectedPages = [1];
      baseFile.status = 'completed';
    } else if (fileInfo.type === 'pdf') {
      const buffer = await file.arrayBuffer();
      const { pages, pageCount, thumbnail } = await parsePdfArrayBuffer(
        buffer,
        fileId,
        file.name,
        (cur, total) => {
          if (onProgress) onProgress(Math.round((cur / total) * 100));
        }
      );
      baseFile.pages = pages;
      baseFile.pageCount = pageCount;
      baseFile.thumbnail = thumbnail;
      baseFile.selectedPages = Array.from({ length: pageCount }, (_, i) => i + 1);
      baseFile.status = 'completed';
    } else if (fileInfo.type === 'docx') {
      const buffer = await file.arrayBuffer();
      const { pages, pageCount } = await parseDocxArrayBuffer(buffer, fileId, file.name);
      baseFile.pages = pages;
      baseFile.pageCount = pageCount;
      baseFile.selectedPages = Array.from({ length: pageCount }, (_, i) => i + 1);
      baseFile.status = 'completed';
    } else if (fileInfo.type === 'xlsx') {
      const buffer = await file.arrayBuffer();
      const { pages, pageCount } = parseExcelArrayBuffer(buffer, fileId, file.name);
      baseFile.pages = pages;
      baseFile.pageCount = pageCount;
      baseFile.selectedPages = Array.from({ length: pageCount }, (_, i) => i + 1);
      baseFile.status = 'completed';
    } else if (fileInfo.type === 'pptx') {
      const buffer = await file.arrayBuffer();
      const { pages, pageCount, warningMessage } = await parsePptxArrayBuffer(
        buffer,
        fileId,
        file.name
      );
      baseFile.pages = pages;
      baseFile.pageCount = pageCount;
      baseFile.warningMessage = warningMessage;
      baseFile.selectedPages = Array.from({ length: pageCount }, (_, i) => i + 1);
      baseFile.status = 'completed';
    } else if (fileInfo.type === 'text') {
      const text = await file.text();
      const { pages, pageCount } = parseTextContent(text, fileId, file.name);
      baseFile.pages = pages;
      baseFile.pageCount = pageCount;
      baseFile.selectedPages = Array.from({ length: pageCount }, (_, i) => i + 1);
      baseFile.status = 'completed';
    }
  } catch (err: unknown) {
    console.error('Error parsing file:', file.name, err);
    baseFile.status = 'error';
    const msg = err instanceof Error ? err.message : String(err);
    baseFile.errorMessage = `文件解析遇到错误：${msg || '未知错误'}。建议转为 PDF 再试。`;
  }

  return baseFile;
}
