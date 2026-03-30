import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});


test('does playwright create folders?', async ({ page }) => {
  await page.goto('https://google.com');
  const popup = page.locator('div')
                  .filter({hasText: 'Before you continue to Google'})
                  // .filter({has: page.locator('button:has-text("Accept all")')})
                  .filter({has: page.locator('text=Terms')})
                  .last();



const box = await popup.boundingBox();
console.log('Popup bounding box:', box);

// Check BOTH Terms links
const termsLink1 = page.locator('text=Terms').first();
const termsBox1 = await termsLink1.boundingBox();
console.log('Terms link 1 box:', termsBox1);

const termsLink2 = page.locator('text=Terms').nth(1); // Second one
const termsBox2 = await termsLink2.boundingBox();
console.log('Terms link 2 box:', termsBox2);



  // await popup.waitFor({state: 'visible'});
  await popup.screenshot({path: 'test-data/screenshots/deep/nested/folder/test.png'});
});

test('screenshot test', async ({ page }) => {
  await page.goto('file://C:/Users/georg/tests/visual-diff-tool/test-data/test-pages/popup.html', { waitUntil: 'networkidle' });

  // const divLocator = page.locator('div').filter({hasText: 'This is a Heading'});


//   // Debug: How many divs match?
// const count = await divLocator.count();
// console.log('Found divs:', count);

// // Only screenshot if we found something
// if (count > 0) {
//   await divLocator.screenshot({path:'test-data/screenshots/dummy-element.png'});
// } else {
//   console.log('No divs found - checking page content...');
//   const content = await page.content();
//   console.log('Page HTML:', content);
// }


  await page.screenshot({path:'test-data/screenshots/dummy-full.png'});

});