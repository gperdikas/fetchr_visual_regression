const {takeScreenshot} = require('./take-screenshot.js');

async function createBaseline(url, locator, baselinePath){
    await takeScreenshot(url, locator, baselinePath)
}

module.exports = {createBaseline};