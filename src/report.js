const fs = require('fs');
const resultFiles = fs.readdirSync('fetchr-results');
let passCounter = 0;
let failCounter = 0;
let criticalCounter = 0;
let majorCounter = 0;
let minorCounter = 0;
let bodyResponse = '';
let statusTest = '';

for (let i = 0; i < resultFiles.length; i++){
  const fullPath = 'fetchr-results' + '/' + resultFiles[i];
  const text = fs.readFileSync(fullPath, 'utf8');
  const data = JSON.parse(text);

  for (let j = 0; j < data.issues.length; j++) {
    if (data.issues[j].severity === 'Critical') {
      criticalCounter++
    } else if (data.issues[j].severity === 'Major') {
      majorCounter++
    } else if (data.issues[j].severity === 'Minor') {
      minorCounter++
    }
  }

  if(data.issues.length === 0) {
    passCounter++;
    statusTest = 'PASS';
  } else {
    failCounter++;
    statusTest = 'FAIL';
  }
  bodyResponse += `TEST ${statusTest} || Risk level: ${data.risk} "${data.title}" - (${data.page}) \n`;

  if (statusTest === 'FAIL') {
    for (let k = 0; k < data.issues.length; k++){
      bodyResponse += `  ${data.issues[k].severity} | ${data.issues[k].title} | ${data.issues[k].description} \n`
    }
  }
}
let totalCases =  passCounter + failCounter;
let totalIssues = criticalCounter + majorCounter + minorCounter;

console.log(' === FETCH REPORT === ');
console.log(`Total cases: ${totalCases} | Passed cases: ${passCounter} | Failed cases: ${failCounter}`)
console.log(`Total issues: ${totalIssues} | Critical severity: ${criticalCounter} | Major severity: ${majorCounter} | Minor severity: ${minorCounter}`);
console.log(bodyResponse);