const {test, expect} = require('@playwright/test');
const {runTool} = require('../../src/run-tool');
const url = 'http://localhost:3000/page1-test'

// test('identical screenshot yields NO_ISSUES', async() => {
//   const result = await runTool(url, '#login-form', 'test-data/screenshots/', 'test-data/designs/baseline-login-form.png');
//   expect(result.risk).toBe('NO_ISSUES');
// });

test('Login form has proper looks', async() => {
  const result = await runTool(url, '#login-form', 'test-data/screenshots/', 'test-data/designs/baseline-login-form.png');
  expect(result.risk).toBe('NO_ISSUES');
});

test('Login form has proper fonts', async() => {
  const steps = async(page) => {
    await page.click('#login-email-inputbox');
    await page.keyboard.type('ABCabc123');
  }
  const result = await runTool(url, '#login-email-inputbox', 'test-data/screenshots/', 'test-data/designs/baseline-login-email-inputbox.png', steps);
  expect(result.risk).toBe('NO_ISSUES');
});

