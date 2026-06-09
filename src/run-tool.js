const {compareImages} = require('./compare-images.js');
const {calculateRiskLevel} = require('./risk-level.js');
const baselinePath = "test-data/designs/dummy-baseline.png";
const currentPath = "test-data/screenshots/dummy-current.png";
let riskResult ;

async function runTool() {
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
