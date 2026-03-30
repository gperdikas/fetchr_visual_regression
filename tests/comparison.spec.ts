import { test, expect } from '@playwright/test';

test('Create baseline', async({page}) => {
    await page.goto('file://C:/Users/georg/tests/visual-diff-tool/test-data/test-pages/popup.html', { waitUntil: 'networkidle' });
   
const content = await page.content();
console.log('Page content length:', content.length);
console.log('Page title:', await page.title());   
   
    await page.screenshot({path: 'test-data/designs/dummy-baseline.png'});
});

test('Take current screenshot', async({page}) => {
    await page.goto('file://C:/Users/georg/tests/visual-diff-tool/test-data/test-pages/popup.html', { waitUntil: 'networkidle' });
    await page.screenshot({path: 'test-data/screenshots/dummy-current.png'});
});