import test from 'node:test';
import assert from 'node:assert/strict';
import { parsePageRange, formatPageRange } from './pageRange';

test('parsePageRange: empty input returns all pages', () => {
  assert.deepEqual(parsePageRange('', 5), [1, 2, 3, 4, 5]);
  assert.deepEqual(parsePageRange('   ', 3), [1, 2, 3]);
});

test('parsePageRange: discrete numbers and ranges', () => {
  assert.deepEqual(parsePageRange('1-3, 5', 5), [1, 2, 3, 5]);
  assert.deepEqual(parsePageRange('2, 4', 5), [2, 4]);
  assert.deepEqual(parsePageRange('1-2, 4-5', 5), [1, 2, 4, 5]);
});

test('parsePageRange: handles Chinese punctuation and spaces', () => {
  assert.deepEqual(parsePageRange('1-3，5；7', 10), [1, 2, 3, 5, 7]);
  assert.deepEqual(parsePageRange('1~3 5', 5), [1, 2, 3, 5]);
});

test('parsePageRange: out of bounds clamping and deduping', () => {
  assert.deepEqual(parsePageRange('0-10', 5), [1, 2, 3, 4, 5]);
  assert.deepEqual(parsePageRange('2, 2, 3-2', 5), [2, 3]);
  assert.deepEqual(parsePageRange('99, 100', 5), []);
});

test('formatPageRange: formats numbers into ranges cleanly', () => {
  assert.equal(formatPageRange([1, 2, 3, 5]), '1-3, 5');
  assert.equal(formatPageRange([1]), '1');
  assert.equal(formatPageRange([]), '');
  assert.equal(formatPageRange([1, 2, 3, 4, 5]), '1-5');
});
