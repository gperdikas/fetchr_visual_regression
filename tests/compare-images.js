const fs = require('fs');
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch').default;

const fileData = fs.readFileSync('test-data/designs/dummy-baseline.png');
const img = PNG.sync.read(fileData);

async function escalateToAi(baselinePath, currentPath, useMock = true) {
  if (useMock) {
    // Return a fake claude response for testing
    return {
      analysis: "Mock response. Button1 has moved 2px to the right (minor), button1 color differs (mid), button3 missing (critical).",
      severity: "high"
    }
  } 
  // add else for real API call until then 
  console.log("Real API call not implemented yet.");
  return null;
}

async function compareImages(baselinePath, currentPath) {
  // Load both images
  const baselineData = fs.readFileSync(baselinePath);
  const baselineImg = PNG.sync.read(baselineData);
  const currentData = fs.readFileSync(currentPath);
  const currentImg = PNG.sync.read(currentData);

  // Compare them with pixelmatch
  const width = baselineImg.width;
  const height = baselineImg.height;
  const diff = new PNG({width: width, height: height});
  const numDiffPixels = pixelmatch(
      baselineImg.data,
      currentImg.data,
      diff.data,
      width,
      height,
      {threshold: 0.05}  
    )
 
  // Calculate percentage difference
  const totalPixels = width*height;
  const differencePercentage = Math.ceil((numDiffPixels/totalPixels)*100);

  if (differencePercentage <= 0.05) {
    console.log(`PASS. ${differencePercentage}% fail on pixel matching.`);
  } else {
    const aiAnalysis = await escalateToAi(baselinePath, currentPath);
    console.log("AI analysis:", aiAnalysis);
    console.log(`AI COMPARISON TRIGGERED. Pixel differentiation is ${differencePercentage}% (${numDiffPixels}/${totalPixels} pixels failed).`);
      // escalate ai
  }

}

// Test it
const result = compareImages(
  'test-data/designs/dummy-baseline.png',
  'test-data/screenshots/dummy-current.png'
);

// console.log('Comparison result:', result);