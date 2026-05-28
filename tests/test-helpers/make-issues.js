
function makeIssues(criticalCount, majorCount, minorCount) {
  let issues = [];
  for (let i=0; i<criticalCount; i++) {
    issues.push({severity: "Critical"})
  }
  for (let i=0; i<majorCount; i++) {
    issues.push({severity: "Major"})
  }
  for (let i=0; i<minorCount; i++) {
    issues.push({severity: "Minor"})
  }
  return issues;
}
module.exports = {makeIssues};




