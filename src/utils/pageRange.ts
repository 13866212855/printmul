/**
 * Parse page range expressions such as "1-3, 5, 8-10" into a sorted array of 1-based page numbers.
 * @param rangeStr User input string, e.g. "1-3, 5"
 * @param totalPages Total number of pages in the document
 * @returns Array of unique, sorted 1-based page numbers
 */
export function parsePageRange(rangeStr: string, totalPages: number): number[] {
  if (totalPages <= 0) return [];
  const trimmed = rangeStr.trim();
  if (!trimmed) {
    // Empty means all pages
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const result = new Set<number>();
  const parts = trimmed.split(/[,，;；\s]+/);

  for (const part of parts) {
    if (!part) continue;
    if (part.includes('-') || part.includes('~') || part.includes('—')) {
      const separator = part.includes('-') ? '-' : part.includes('~') ? '~' : '—';
      const [startStr, endStr] = part.split(separator);
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);

      if (!isNaN(start) && !isNaN(end)) {
        const min = Math.max(1, Math.min(start, end));
        const max = Math.min(totalPages, Math.max(start, end));
        for (let p = min; p <= max; p++) {
          result.add(p);
        }
      } else if (!isNaN(start) && isNaN(end)) {
        if (start >= 1 && start <= totalPages) {
          result.add(start);
        }
      }
    } else {
      const num = parseInt(part, 10);
      if (!isNaN(num) && num >= 1 && num <= totalPages) {
        result.add(num);
      }
    }
  }

  const sorted = Array.from(result).sort((a, b) => a - b);
  // If user typed something invalid that yielded 0 pages, fallback to all pages or empty
  return sorted;
}

/**
 * Format page numbers back to a short summary (e.g. [1,2,3,5] -> "1-3, 5")
 */
export function formatPageRange(pages: number[]): string {
  if (!pages.length) return '';
  const sorted = [...pages].sort((a, b) => a - b);
  const ranges: string[] = [];
  let start = sorted[0];
  let prev = sorted[0];

  for (let i = 1; i < sorted.length; i++) {
    const cur = sorted[i];
    if (cur === prev + 1) {
      prev = cur;
    } else {
      ranges.push(start === prev ? `${start}` : `${start}-${prev}`);
      start = cur;
      prev = cur;
    }
  }
  ranges.push(start === prev ? `${start}` : `${start}-${prev}`);
  return ranges.join(', ');
}
