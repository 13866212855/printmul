import test from 'node:test';
import assert from 'node:assert/strict';
import * as XLSX from 'xlsx';
import { parseExcelArrayBuffer } from './excelRenderer';

test('parseExcelArrayBuffer: breaks 65 rows into multiple pages with repeating headers', () => {
  const data = [
    ['序号', '名称', '单价', '数量', '总额'],
  ];
  for (let i = 1; i <= 65; i++) {
    data.push([String(i), `产品 ${i}`, String(i * 10), '2', String(i * 20)]);
  }

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, '销售报表');
  const buf = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });

  const result = parseExcelArrayBuffer(buf, 'file-1', 'sales.xlsx');
  // 65 data rows / 30 rows per page = 3 pages
  assert.equal(result.pageCount, 3);
  assert.equal(result.pages.length, 3);
  assert.equal(result.pages[0].tableData?.headers.length, 5);
  assert.equal(result.pages[0].tableData?.rows.length, 30);
  assert.equal(result.pages[1].tableData?.rows.length, 30);
  assert.equal(result.pages[2].tableData?.rows.length, 5);
  // All pages keep the headers!
  assert.deepEqual(result.pages[2].tableData?.headers, ['序号', '名称', '单价', '数量', '总额']);
});
