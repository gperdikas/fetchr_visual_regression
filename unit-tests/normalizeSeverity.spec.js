const {test, expect} = require('@playwright/test');
const {normalizeOneSeverity} = require('../src/normalize-severity');
const {normalizeSeverities} = require('../src/normalize-severity');

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

test('Try to normalize other wording returns original value', () => {
  const result = normalizeOneSeverity('Red code');
  expect(result).toBe('Red code');
});

test('Normalise all-capitals valid severity', () => {
  const result = normalizeSeverities([
    {severity: 'MAJOR', title: 'Missing button', description: 'Save button is missing on bottom-right corner'}
  ]);
  expect(result).toEqual([
    {severity: 'Major', title: 'Missing button', description: 'Save button is missing on bottom-right corner'}
  ]);
});

test('Preserves unknown severity', () => {
  const result = normalizeSeverities([
    {severity: 'MEdium', title: 'Missing button', description: 'Save button is missing on bottom-right corner'}
  ]);
  expect(result).toEqual([
    {severity: 'MEdium', title: 'Missing button', description: 'Save button is missing on bottom-right corner'}
  ]);
});

test('Normalise 2 valid severities', () => {
  const result = normalizeSeverities([
    {severity: 'CRItical', title: 'Missing button', description: 'Save button is missing on bottom-right corner'},
    {severity: 'MAJOR', title: 'Missing button', description: 'Save button is missing on bottom-right corner'}
  ]);
  expect(result).toEqual([
    {severity: 'Critical', title: 'Missing button', description: 'Save button is missing on bottom-right corner'},
    {severity: 'Major', title: 'Missing button', description: 'Save button is missing on bottom-right corner'}
  ]);
});

test('Normalise 1 valid severities and preserve 1 unknown', () => {
  const result = normalizeSeverities([
    {severity: 'CRItical', title: 'Missing button', description: 'Save button is missing on bottom-right corner'},
    {severity: 'MEDIUM', title: 'Missing button', description: 'Save button is missing on bottom-right corner'}
  ]);
  expect(result).toEqual([
    {severity: 'Critical', title: 'Missing button', description: 'Save button is missing on bottom-right corner'},
    {severity: 'MEDIUM', title: 'Missing button', description: 'Save button is missing on bottom-right corner'}
  ]);
});

test('Preserve empty array', () => {
  const result = normalizeSeverities([]);
  expect(result).toEqual([]);
});