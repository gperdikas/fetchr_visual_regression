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
        system: `You are a visual regression tester. Your role is to compare between the images sent to you. 
                There will be visual differences between them. 
                You must identify this differentiation by issue and categorize it by its severity.
                
                Each issue should be characterized by its severity. 
                The severity can be 'Critical', 'Medium' or 'Minor'. 
                Critical severity means that an item (e.g. a button, an input box, a text) is missing. 
                Medium severity is when an item is not missing but there are changes that will surely be 
                seen by the user but won't be able to break any functionality (e.g. different colours, 
                different fonts, or differences on an existing text). 
                Minor severity means that there are some differences on an item but will probably not be 
                noticed by the user (e.g. a button is 2 px to the right).
                
                Your output should have the following format:
                It has to contain 2 crucial parts. The analysis and the issues.
                On the analysis part I need a human-readable text which will contain info about the results.
                Example on analysis: Test completed. 2 Critical, 0 Medium and 5 Minor issues are found.
                On the issues part I need one line for each issue. Each line should contain 'severity', 'title' and 'description'.
                Example on an issue: {"severity": "Critical", "title": "Missing Save button", "description":"Save button on item titled as 'Create a user' is missing."}
                Each distinct finding must be its own item in the issues array. 
                Each issue must describe exactly one finding. If a single element has multiple problems 
                (e.g. a button has wrong text and wrong position), each problem is a separate issue in the array.

                A complete response should look like :
                {
                  "analysis": "Text as described above",
                  "issues": [
                    {"severity": "", "title": "", "description": ""}  
                  ]
                }

                Don't give the response as a markdown or a preamble text. Return only valid JSON. The response must be parseable by JSON.parse().
                `
              ,
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
              text: `Compare these two images. Please respond in the required JSON format.`
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

  // give value 0.1 only to trigger AI testing whatever happens , 5 for mock
  if (differencePercentage <= 0.1) {
    console.log(`PASS. ${differencePercentage.toFixed(2)}% of total pixel number fail on pixel matching.`);
  } else {
    const aiAnalysis = await escalateToAi(baselinePath, currentPath, false); // add false to run with AI call, delete it to run with mock
    console.log("AI analysis:", aiAnalysis);
    console.log(`AI COMPARISON TRIGGERED. Pixel differentiation is ${differencePercentage}% (${numberDiffPixels}/${totalPixels} pixels failed).`);
  }
}

// Test it
const result = compareImages(
  'test-data/designs/dummy-baseline.png',
  'test-data/screenshots/dummy-current.png'
);

