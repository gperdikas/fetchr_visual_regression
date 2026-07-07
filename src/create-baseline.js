const {takeScreenshot} = require('./take-screenshot.js');

async function createBaseline(url, locator, baselinePath, steps){
    await takeScreenshot(url, locator, baselinePath, steps)
}

module.exports = {createBaseline};