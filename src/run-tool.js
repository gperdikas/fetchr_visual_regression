const {takeScreenshot} = require('./take-screenshot.js');
const {compareImages} = require('./compare-images.js');
const {calculateRiskLevel} = require('./risk-level.js');
const {normalizeSeverities} = require('./normalize-severity.js');
const {validateIssues} = require('./response-validator.js');
let riskResult ;

async function runTool(url, locator, savePath, baselinePath, steps) {
  const currentPath = await takeScreenshot(url, locator, savePath, steps);
  const result = await compareImages(baselinePath, currentPath);
  if (result.escalatedToAi === true) {
    const normalizedIssues = normalizeSeverities(result.issues);
    validateIssues(normalizedIssues);
    riskResult = calculateRiskLevel(normalizedIssues);
  } else {
    riskResult = "NO_ISSUES";
  }
const finalResult = { risk: riskResult, analysis: result.analysis, issues: result.issues, differencePercentage: result.differencePercentage };
return finalResult;
}
module.exports = {runTool};