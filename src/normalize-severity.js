function normalizeOneSeverity (severityValue) {
  const severityValueLower = severityValue.toLowerCase();
  if (severityValueLower === 'critical') {
    return 'Critical';
  } else if (severityValueLower === 'major') {
    return 'Major';
  } else if (severityValueLower === 'minor') {
    return 'Minor';
  } else {
    return severityValue;
  }
}

function normalizeSeverities (issuesArray) {
  const newArray = [];
  for (let i=0; i<issuesArray.length; i++){
    const newSeverity = normalizeOneSeverity(issuesArray[i].severity);
    newArray.push({
      severity: newSeverity,
      title: issuesArray[i].title,
      description: issuesArray[i].description 
    });
  }
  return newArray;
}

module.exports = {normalizeSeverities, normalizeOneSeverity};
