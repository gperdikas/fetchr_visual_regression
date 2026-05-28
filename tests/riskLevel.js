function calculateRiskLevel(issues) {
  let countCritical = 0;
  let countMajor = 0;
  let countMinor = 0;

  for (let i = 0; i < issues.length; i++) {
    if (issues[i].severity === "Critical") {
      countCritical++;
    } else if (issues[i].severity === "Major") {
      countMajor++;
    } else if (issues[i].severity === "Minor") {
      countMinor++;
    } else {
      throw new Error(`Unknown severity value: ${issues[i].severity}`);
    }
  }

  if (countCritical >=1) return "HIGH";
  if (countMajor >= 5) return "HIGH";
  if (countMajor >= 1 && countMinor >= 20) return "HIGH";
  if (countMajor >=1) return "MEDIUM";
  if (countMinor >= 50) return "HIGH";
  if (countMinor >= 10) return "MEDIUM";
  return "LOW";
}
module.exports = {calculateRiskLevel};
