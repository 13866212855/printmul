import { PageItem } from '../types';

const LINES_PER_PAGE = 42;
const MAX_CHARS_PER_LINE = 85;

export function wrapText(text: string, maxChars = MAX_CHARS_PER_LINE): string[] {
  const rawLines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  const wrappedLines: string[] = [];

  for (const rawLine of rawLines) {
    if (rawLine.length === 0) {
      wrappedLines.push('');
      continue;
    }

    let remaining = rawLine;
    while (remaining.length > 0) {
      if (remaining.length <= maxChars) {
        wrappedLines.push(remaining);
        break;
      }

      // Check for space/punctuation break point
      let breakIdx = -1;
      for (let i = maxChars; i >= maxChars - 20 && i > 0; i--) {
        const char = remaining[i];
        if (char === ' ' || char === '\t' || char === '，' || char === '。' || char === '；' || char === ',' || char === '.') {
          breakIdx = i + 1;
          break;
        }
      }

      if (breakIdx === -1) {
        breakIdx = maxChars;
      }

      wrappedLines.push(remaining.substring(0, breakIdx));
      remaining = remaining.substring(breakIdx);
    }
  }

  return wrappedLines;
}

export function parseTextContent(
  content: string,
  fileId: string,
  fileName: string
): { pages: PageItem[]; pageCount: number } {
  const lines = wrapText(content);
  const totalPages = Math.max(1, Math.ceil(lines.length / LINES_PER_PAGE));
  const pages: PageItem[] = [];

  for (let p = 0; p < totalPages; p++) {
    const pageLines = lines.slice(p * LINES_PER_PAGE, (p + 1) * LINES_PER_PAGE);
    pages.push({
      id: `${fileId}-text-p${p + 1}`,
      fileId,
      fileName,
      fileType: 'text',
      pageIndex: p,
      totalInFile: totalPages,
      globalIndex: 0,
      orientation: 'portrait',
      renderType: 'html',
      htmlContent: pageLines.join('\n'),
    });
  }

  return { pages, pageCount: totalPages };
}
