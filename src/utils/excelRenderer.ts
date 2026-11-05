import * as XLSX from 'xlsx';
import { PageItem } from '../types';

export interface ExcelParseResult {
  pages: PageItem[];
  pageCount: number;
  thumbnail?: string;
  sheetNames: string[];
}

const ROWS_PER_PAGE = 30; // standard comfortable row count for A4 table

export function parseExcelArrayBuffer(
  buffer: ArrayBuffer,
  fileId: string,
  fileName: string
): ExcelParseResult {
  const workbook = XLSX.read(buffer, { type: 'array' });
  const pages: PageItem[] = [];

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) continue;

    // Convert sheet to 2D array
    const rawData = XLSX.utils.sheet_to_json<(string | number)[]>(sheet, {
      header: 1,
      defval: '',
      blankrows: false,
    });

    if (!rawData || rawData.length === 0) continue;

    // Determine header
    const headers = (rawData[0] || []).map((h) => String(h || '').trim());
    const dataRows = rawData.slice(1);

    if (dataRows.length === 0) {
      // Just header row
      pages.push({
        id: `${fileId}-sheet-${sheetName}-p1`,
        fileId,
        fileName,
        fileType: 'xlsx',
        pageIndex: pages.length,
        totalInFile: 1,
        globalIndex: 0,
        orientation: 'portrait',
        renderType: 'table',
        tableData: {
          sheetName,
          headers,
          rows: [],
          startRow: 1,
          totalRows: 0,
          pageNum: 1,
          totalPages: 1,
        },
      });
      continue;
    }

    // Chunk data rows into pages
    const totalPagesForSheet = Math.ceil(dataRows.length / ROWS_PER_PAGE);

    for (let p = 0; p < totalPagesForSheet; p++) {
      const pageRows = dataRows.slice(p * ROWS_PER_PAGE, (p + 1) * ROWS_PER_PAGE);
      pages.push({
        id: `${fileId}-sheet-${sheetName}-p${p + 1}`,
        fileId,
        fileName,
        fileType: 'xlsx',
        pageIndex: pages.length,
        totalInFile: 0, // will update below
        globalIndex: 0,
        orientation: headers.length > 7 ? 'landscape' : 'portrait',
        renderType: 'table',
        tableData: {
          sheetName,
          headers,
          rows: pageRows,
          startRow: p * ROWS_PER_PAGE + 1,
          totalRows: dataRows.length,
          pageNum: p + 1,
          totalPages: totalPagesForSheet,
        },
      });
    }
  }

  // Update totalInFile for each page
  const total = pages.length || 1;
  pages.forEach((page, idx) => {
    page.pageIndex = idx;
    page.totalInFile = total;
  });

  return {
    pages,
    pageCount: total,
    sheetNames: workbook.SheetNames,
  };
}
