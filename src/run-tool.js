const {takeScreenshot} = require('./take-screenshot.js');
const {compareImages} = require('./compare-images.js');
const {calculateRiskLevel} = require('./risk-level.js');
const {normalizeSeverities} = require('./normalize-severity.js');
const {validateIssues} = require('./response-validator.js');
const baselinePath = "test-data/designs/login-form-baseline.png";
// const currentPath = "test-data/screenshots/dummy-current.png";
let riskResult ;

async function runTool(url, locator, savePath) {
  const currentPath = await takeScreenshot(url, locator, savePath);
  const result = await compareImages(baselinePath, currentPath);
  if (result.escalatedToAi === true) {
    const normalizedIssues = normalizeSeverities(result.issues);
    validateIssues(normalizedIssues);
    riskResult = calculateRiskLevel(normalizedIssues);
  } else {
    riskResult = "NO_ISSUES";
  }
const finalResult = { risk: riskResult, analysis: result.analysis, issues: result.issues, differencePercentage: result.differencePercentage };
console.log(finalResult);
}
module.exports = {runTool};