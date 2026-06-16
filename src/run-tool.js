const {takeScreenshot} = require('./take-screenshot.js');
const {compareImages} = require('./compare-images.js');
const {calculateRiskLevel} = require('./risk-level.js');
const baselinePath = "test-data/designs/login-form-baseline.png";
// const currentPath = "test-data/screenshots/dummy-current.png";
let riskResult ;

async function runTool() {

  const url = "http://localhost:3000/page1";
  const locator = "#login-form";
  const savePath = "test-data/screenshots/";
  const currentPath = await takeScreenshot(url, locator, savePath);
// call here take-screenshot to craete the currentPath (pic to be tested)
// maybe on each test's object add the baselinePath (pic saved as the basis to check on)


  const result = await compareImages(baselinePath, currentPath);
  if (result.escalatedToAi === true) {
    riskResult = calculateRiskLevel(result.issues);
  } else {
    riskResult = "NO_ISSUES";
  }

// return something that will be translated to a print msg, or print msg
const finalResult = { risk: riskResult, issues: result.issues, differencePercentage: result.differencePercentage };
console.log(finalResult);
}
runTool();
//      return {differencePercentage, pixelCheckPassed, escalatedToAi, issues};
