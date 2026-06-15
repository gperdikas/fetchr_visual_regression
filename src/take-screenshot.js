const {chromium} = require('playwright');

async function takeScreenshot(url, locator, savePath){

    // open browser & page
    const browser = await chromium.launch();
    const page = await browser.newPage({viewport: {width:1920, height:1080}});
    await page.goto(url);

    const buildPath = savePath + locator.replaceAll("#","") + ".png";
    console.log("buildPath is:", buildPath);  
    const item = page.locator(locator);
    await item.screenshot({path: buildPath});

    await browser.close();
}

takeScreenshot('http://localhost:3000/page1', '#login-form', 'test-data/screenshots/');