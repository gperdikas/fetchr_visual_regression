const {test, expect} = require('@playwright/test');
const {makeOneIssue} = require('./test-helpers/make-one-issue');
const {validateIssues} = require('../src/response-validator');

// Not an array as a response
test('AI analysis does not return an array', () => {
  const issueArray = 42;
  expect( () => validateIssues(issueArray)).toThrow("Input is not an array");
});

// Empty array as a response
test('AI analysis returns an empty array', () => {
  const issueArray = [];
  expect( () => validateIssues(issueArray)).not.toThrow();
});

// severity is ""
test('Severity on AI analysis response is ""', () => {
  const issueArray = [makeOneIssue("", "Missing button", "Save button is missing")];
  expect( () => validateIssues(issueArray)).toThrow("Given severity is empty");
});

// title is ""
test('Title on AI analysis response is ""', () => {
  const issueArray = [makeOneIssue("Major", "", "Save button is missing")];
  expect( () => validateIssues(issueArray)).toThrow("Given title is empty");
});

// description is ""
test('Description on AI analysis response is ""', () => {
  const issueArray = [makeOneIssue("Major", "Missing button", "")];
  expect( () => validateIssues(issueArray)).toThrow("Given description is empty");
});

// severity undefined
test('Severity on AI analysis response is undefined', () => {
  const issueArray = [makeOneIssue(undefined, "Missing button", "Save button is missing")];
  expect( () => validateIssues(issueArray)).toThrow("Given severity is undefined");
});

// title undefined
test('Title on AI analysis response is undefined', () => {
  const issueArray = [makeOneIssue("Major", undefined, "Save button is missing")];
  expect( () => validateIssues(issueArray)).toThrow("Given title is undefined");
});

// description undefined
test('Description on AI analysis response is undefined', () => {
  const issueArray = [makeOneIssue("Major", "Missing button", undefined)];
  expect( () => validateIssues(issueArray)).toThrow("Given description is undefined");
});

// severity is medium
test('Severity value is not as should', () => {
  const issueArray = [makeOneIssue("Red code", "Missing button", "Save button is missing")];
  expect( () => validateIssues(issueArray)).toThrow("Invalid severity. Must be 'Critical', 'Major' or 'Minor'");
});

// severity has proper value
test('Severity value is proper', () => {
  const issueArray = [makeOneIssue("Major", "Missing button", "Save button is missing")];
  expect(() => validateIssues(issueArray)).not.toThrow();
});