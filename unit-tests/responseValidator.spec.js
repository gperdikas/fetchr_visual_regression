const {test, expect} = require('@playwright/test');
// const {makeOneIssue} = require('./test-helpers/make-one-issue');
const {validateIssues} = require('../src/response-validator');

// Not an array as a response
test('AI analysis does not return an array', ()=> {
  const issueArray = 42;
  expect( ()=> validateIssues(issueArray)).toThrow("Input is not an array");
});

// Empty array as a response
test('AI analysis returns an empty array', ()=> {
  const issueArray = [];
  expect( ()=> validateIssues(issueArray)).not.toThrow();
});