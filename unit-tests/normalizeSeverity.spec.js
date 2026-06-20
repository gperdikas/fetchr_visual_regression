const {test, expect} = require('@playwright/test');
const {normalizeOneSeverity} = require('../src/normalize-severity');

test('Normalize mixed Upper & Lower case wording', () => {
  const result = normalizeOneSeverity('CRIticAl');
  expect(result).toBe('Critical');
});

test('Normalize only Upper case wording', () => {
  const result = normalizeOneSeverity('MAJOR');
  expect(result).toBe('Major');
});

test('Normalize only Lower case wording', () => {
  const result = normalizeOneSeverity('minor');
  expect(result).toBe('Minor');
});

test('Try to normalize other wording returns undefined', () => {
  const result = normalizeOneSeverity('red code');
  expect(result).toBe('red code');
});