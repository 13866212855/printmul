import test from 'node:test';
import assert from 'node:assert/strict';
import { detectFileType, formatFileSize } from './fileType';

test('detectFileType: supported formats', () => {
  assert.equal(detectFileType('report.pdf').type, 'pdf');
  assert.equal(detectFileType('document.docx').type, 'docx');
  assert.equal(detectFileType('data.xlsx').type, 'xlsx');
  assert.equal(detectFileType('records.csv').type, 'xlsx');
  assert.equal(detectFileType('slides.pptx').type, 'pptx');
  assert.equal(detectFileType('photo.png').type, 'image');
  assert.equal(detectFileType('notes.txt').type, 'text');
  assert.equal(detectFileType('readme.md').type, 'text');
});

test('detectFileType: unsupported formats with friendly advice', () => {
  const legacyWord = detectFileType('old.doc');
  assert.equal(legacyWord.type, 'unsupported');
  assert.equal(legacyWord.isSupported, false);
  assert.match(legacyWord.advice || '', /\.docx 或 PDF/);

  const legacyPpt = detectFileType('presentation.ppt');
  assert.equal(legacyPpt.type, 'unsupported');
  assert.equal(legacyPpt.isSupported, false);
  assert.match(legacyPpt.advice || '', /\.pptx 或 PDF/);

  const zipFile = detectFileType('archive.zip');
  assert.equal(zipFile.type, 'unsupported');
  assert.match(zipFile.advice || '', /解压/);
});

test('formatFileSize: human readable sizes', () => {
  assert.equal(formatFileSize(500), '500 B');
  assert.equal(formatFileSize(1024), '1.0 KB');
  assert.equal(formatFileSize(1024 * 1024 * 2.5), '2.5 MB');
});
