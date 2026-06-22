const {chromium} = require('playwright');
const {toolConfiguration} = require('../tool-config');
async function takeScreenshot(url, locator, savePath){

    // open browser & page
    const browser = await chromium.launch();
    const page = await browser.newPage({viewport: toolConfiguration.viewport});
    await page.goto(url);

    const buildPath = savePath + locator.replaceAll("#","") + ".png";
    console.log("buildPath is:", buildPath);  
    const item = page.locator(locator);
    await item.screenshot({path: buildPath});

    await browser.close();
    return buildPath;
}
module.exports = {takeScreenshot};
// takeScreenshot('http://localhost:3000/page1', '#login-form', 'test-data/screenshots/');