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
  const result = await compareImages(baselinePath, currentPath);
  if (result.escalatedToAi === true) {
    riskResult = calculateRiskLevel(result.issues);
  } else {
    riskResult = "NO_ISSUES";
  }

const finalResult = { risk: riskResult, analysis: result.analysis, issues: result.issues, differencePercentage: result.differencePercentage };
console.log(finalResult);
}
runTool();
