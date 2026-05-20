require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch').default;

async function escalateToAi(baselinePath, currentPath, useMock = true) {
  if (useMock) {
    // Return a fake claude response for testing
    return {
      analysis: "Mock response. Button1 has moved 2px to the right (minor), button1 color differs (mid), button3 missing (critical).",
      severity: "high"
    }
  } else {

    // Real Claude response
    const baselineData = fs.readFileSync(baselinePath);
    const baselineBase64 = baselineData.toString('base64');
    const currentData = fs.readFileSync(currentPath);
    const currentBase64 = currentData.toString('base64');

    // Create client
    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });

    // Send request to Claude
    const response = await client.messages.create({
      model:"claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            // baseline img
            {
              type: "text",
              text: "Design baseline (expected)"
            },
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/png",
                data: baselineBase64
              }
            },
            // current img
            {
              type: "text",
              text:"Current Implementation (actual)"
            },
            {
              type: "image",
              source: {
                type: "base64",
                media_type:"image/png",
                data: currentBase64
              }
            },
            // prompt
            {
              type: "text",
              text: "Compare these images. Identify all differencies and categorize: CRITICAL (breaks functionality), MEDIUM(visible issue but functional), MINOR(imperceptible issue). List each issue with category."
            }
          ]
        }
      ]
    });

    // Extract and return Claude's answer
    const analysisText = response.content[0].text;
    return {
      analysis: analysisText,
      severity: "unknown"
    }
  } 
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
  const numberDiffPixels = pixelmatch(
    baselineImg.data,
    currentImg.data,
    diff.data,
    width,
    height,
    {threshold: 0.05}
  )
  // Calculate percentage difference
  const totalPixels = width*height;
  const differencePercentage = (numberDiffPixels/totalPixels)*100;

  // give value 0.1 only to trigger AI testing whatever happens 
  if (differencePercentage <= 5) {
    console.log(`PASS. ${differencePercentage.toFixed(2)}% of total pixel number fail on pixel matching.`);
  } else {
    const aiAnalysis = await escalateToAi(baselinePath, currentPath); // add false to run with AI call, delete it to run with mock
    console.log("AI analysis:", aiAnalysis);
    console.log(`AI COMPARISON TRIGGERED. Pixel differentiation is ${differencePercentage}% (${numberDiffPixels}/${totalPixels} pixels failed).`);
  }
}

// Test it
const result = compareImages(
  'test-data/designs/dummy-baseline.png',
  'test-data/screenshots/dummy-current.png'
);

