const {test, expect} = require('@playwright/test');
const {runTool} = require('../../src/run-tool');
const {saveTestResult} = require('../../helpers/saveTestResult');
const url = 'http://localhost:3000/page1-test';
const testPage = 'page1';


test('Login form has proper looks', async({}, testInfo) => {
  const result = await runTool(url, '#login-form', 'test-data/screenshots/', 'test-data/designs/baseline-login-form.png');
  saveTestResult(testInfo, testPage, result);
  expect(result.risk).toBe('NO_ISSUES');
});

test('Login form has proper fonts', async({}, testInfo) => {
  const steps = async(page) => {
    await page.click('#login-email-inputbox');
    await page.keyboard.type('ABCabc123');
  }
  const result = await runTool(url, '#login-email-inputbox', 'test-data/screenshots/', 'test-data/designs/baseline-login-email-inputbox.png', steps);
  saveTestResult(testInfo, testPage, result);
  expect(result.risk).toBe('NO_ISSUES');
});

