const {test, expect} = require('@playwright/test');
const {runTool} = require('../../src/run-tool');
const fs = require('fs');
const url = 'http://localhost:3000/page1-test';
const testPage = 'page1';

test('Create user form has proper looks', async({}, testInfo) => {
  const testTitleSpaces = testInfo.title;
  const testTitle = testTitleSpaces.replaceAll(/[ ?:!]/g, "_");
  const result = await runTool(url, '#create-user-form', 'test-data/screenshots/', 'test-data/designs/baseline-create-user-form.png');
  console.log(result);
  const testResult = {
    page: testPage,
    title: testTitle,
    issues: result.issues,
  }
  const testResultsText = JSON.stringify(testResult);
  fs.writeFileSync(`fetchr-results/${testPage}-${testTitle}.json`, testResultsText);
  expect(result.risk).toBe('NO_ISSUES');
});

test('Create user form has proper fonts', async() => {
  const steps = async(page) => {
    await page.click('#create-user-first-inputbox');
    await page.keyboard.type('ABCabc123');
  }
  const result = await runTool(url, '#create-user-first-inputbox', 'test-data/screenshots/', 'test-data/designs/baseline-create-user-first-inputbox.png', steps);
  console.log(result);
  expect(result.risk).toBe('NO_ISSUES');
});


if (!fs.existsSync(`fetchr-results`)) {
  fs.mkdirSync(`fetchr-results`);
}
