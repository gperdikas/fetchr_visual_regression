const fs = require('fs');

function saveTestResult(testInfo, testPage, result){
  const testTitleSpaces = testInfo.title;
  const testTitle = testTitleSpaces.replaceAll(/[ ?:!]/g, "_");
  const testResult = {
    page: testPage,
    title: testTitle,
    issues: result.issues,
    risk: result.risk
  }
  const testResultsText = JSON.stringify(testResult);
  fs.writeFileSync(`fetchr-results/${testPage}-${testTitle}.json`, testResultsText);
}

module.exports = {saveTestResult};
