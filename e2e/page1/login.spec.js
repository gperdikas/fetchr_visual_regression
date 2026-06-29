const {test, expect} = require('@playwright/test');
const {runTool} = require('../../src/run-tool');
const url = 'http://localhost:3000/page1'

test('identical screenshot yields NO_ISSUES', async () => {
  const result = await runTool(url, '#login-form', 'test-data/screenshots/', 'test-data/designs/baseline-login-form.png');
  expect(result.risk).toBe('NO_ISSUES');
});