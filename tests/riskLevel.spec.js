const {test, expect} = require('@playwright/test');
const {calculateRiskLevel} = require ('./riskLevel');
const {makeIssues} = require('./test-helpers/make-issues');

//High severity tests
test('1 critical issue returns High (risk level)', () => {
  const issues = makeIssues(1, 0, 0);
  const risk = calculateRiskLevel(issues);
  expect(risk).toBe("HIGH");
});

test('More than 1 critical issues return High (risk level)', () => {
  const issues = makeIssues(4, 0, 0);
  const risk = calculateRiskLevel(issues);
  expect(risk).toBe("HIGH");
});

test('5 or more major issues return High (risk level)', () => {
  const issues = makeIssues(0, 5, 0);
  const risk = calculateRiskLevel(issues);
  expect(risk).toBe("HIGH");
});

test('5 or more major issues (10) return High (risk level)', () => {
  const issues = makeIssues(0, 10, 0);
  const risk = calculateRiskLevel(issues);
  expect(risk).toBe("HIGH");
});

test('Less than 5 major (4) & 20 or more minor issues return High (risk level)', () => {
  const issues = makeIssues(0, 4, 21);
  const risk = calculateRiskLevel(issues);
  expect(risk).toBe("HIGH");
});

test('Less than 5 major (1) & 20 or more minor issues return High (risk level)', () => {
  const issues = makeIssues(0, 1, 21);
  const risk = calculateRiskLevel(issues);
  expect(risk).toBe("HIGH");
});

test('50 or more (50) minor issues return High (risk level)', () => {
  const issues = makeIssues(0, 0, 50);
  const risk = calculateRiskLevel(issues);
  expect(risk).toBe("HIGH");
});

test('50 or more (70) minor issues return High (risk level)', () => {
  const issues = makeIssues(0, 0, 70);
  const risk = calculateRiskLevel(issues);
  expect(risk).toBe("HIGH");
});

//Medium severity tests
test('Less than 5 major issues return Medium (risk level)', () => {
  const issues = makeIssues(0, 4, 0);
  const risk = calculateRiskLevel(issues);
  expect(risk).toBe("MEDIUM");
});

test('Less than 5 major issues (1) return Medium (risk level)', () => {
  const issues = makeIssues(0, 1, 0);
  const risk = calculateRiskLevel(issues);
  expect(risk).toBe("MEDIUM");
});

test('10 or more minor issues (10) return Medium (risk level)', () => {
  const issues = makeIssues(0, 0, 10);
  const risk = calculateRiskLevel(issues);
  expect(risk).toBe("MEDIUM");
});

test('10 or more minor issues (14) return Medium (risk level)', () => {
  const issues = makeIssues(0, 0, 14);
  const risk = calculateRiskLevel(issues);
  expect(risk).toBe("MEDIUM");
});

//Low severity tests
test('Less than 10 minor issues (9) return Low (risk level)', () => {
  const issues = makeIssues(0, 0, 9);
  const risk = calculateRiskLevel(issues);
  expect(risk).toBe("LOW");
});

test('Less than 10 minor issues (1) return Low (risk level)', () => {
  const issues = makeIssues(0, 0, 1);
  const risk = calculateRiskLevel(issues);
  expect(risk).toBe("LOW");
});