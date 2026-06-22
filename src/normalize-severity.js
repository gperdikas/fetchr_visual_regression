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


function normalizeSeverities () {
  
}

module.exports = {normalizeSeverities}
module.exports = {normalizeOneSeverity};
