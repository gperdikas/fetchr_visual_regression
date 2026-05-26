require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch').default;

async function escalateToAi(baselinePath, currentPath, useMock = true) {
  if (useMock) {
    // Return a fake claude response for testing
    return {
      analysis: "Mock response. 1 Critical, 1 Medium and 1 Minor issues found.",
      issues: [
        {severity: "Critical", title:"Missing 'Save' button", description: "Save button should be present near the bottom-right corner on the popup."},
        {severity: "Medium", title:"Wrong colour on 'Cancel' button", description: "'Cancel' button should be gray."},
        {severity: "Minor", title:"Cancel button 2px off", description: "'Cancel' button is positioned 2px to the left, compared to where it should be."}
      ]
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
        system:
        /*
         `
        ## Role
        You are a visual regression tester. Your role is to compare between the images sent to you. 
        There will be visual differences between them. 
        You must identify this differentiation by issue and categorize it by its severity.
              
        ## Severity definition
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
                Each issue must describe exactly one finding. If a single element has multiple problems, 
                each problem must be reported as its own separate issue. Findings must never be grouped 
                into a single issue.

                Examples:
                1. A button has wrong text AND wrong position. Each of these two problems must be 
                reported as its own separate issue in the issues array. (Findings must not be grouped 
                just because they occure on the same element.)

                2. Two different buttons should both contain the text 'Save'. Due to a typo, both 
                show 'Saave' instead. The fact that both elements have the exact same problem must 
                not lead to grouping them into a single issue — they remain two separate issues.

                3. A new paragraph and a new button have both been added to the same section of the page. 
                Even though they appear together and were likely added as part of the same change, 
                they are two distinct elements with two distinct findings — they must be reported as two separate issues.

                4. A paragraph contains several sentences and many words. The paragraph as a whole is one new 
                element, not a collection of new elements (words or sentences). This counts as one issue, not multiple. 
                The internal complexity of a single element does not split it into multiple issues.

                
                A complete response should look like :
                {
                  "analysis": "Text as described above",
                  "issues": [
                    {"severity": "", "title": "", "description": ""}  
                  ]
                }

                Don't give the response as a markdown or a preamble text. Return only valid JSON. The response must be parseable by JSON.parse().
                `
              */
             `
              ## Role
                You are a visual regression tester. Your role is to compare between the images sent to you. 
                There will be visual differences between them. 
                You must identify this differentiation by issue and categorize it by its severity.

              ## Severity definition
                Each issue should be characterized by its severity. 
                The severity can be 'Critical', 'Major' or 'Minor'. 

                - Critical severity : 
                --  Critical severity means that application's functionality is broken. This could happen when : 1. an 
                element is missing, 2. an element exists when it shouldn't, 3. an element is changed.
                - Major severity :
                -- Major severity means that application's functionality is not broken, but : 1. an element is missing, 
                2. an element exists when it shouldn't, 3. an element is changed. The difference can be noticed by a human user. 
                - Minor severity :
                -- Minor severity means that application's functionality is not broken, but : 1. an element is missing, 
                2. an element exists when it shouldn't, 3. an element is changed. The difference cannot be noticed easily by a 
                human user.

              ## Examples
                - Critical severity :
                -- A button or an input box that is missing, without which the user cannot provide info necessary to 
                continue.
                -- A text that is missing and should be there because it contains crucial info for the user, for example 
                instructions for a valid password.
                -- An input box is duplicated. User experience will be broken. Also if user adds value on both, an error 
                might occur.
                -- A button might be misplaced and cover another button and make it unclickable.

                - Major severity
                -- A currency sign might not be shown next to a value input box
                -- A non functional icon might not be shown
                -- The specific font of a text element (bold, italics, font color, etc.) is different.
                -- Differences in a text. A sentence or more is missing or differ.
                -- A button has total different colour.

                - Minor severity
                -- An element has the wrong position, on the level of a few pixels.
                -- A button's colour is slightly different
                -- Differences in a text. The majority of the text is correct but some elements (letters or words level) 
                are missing or differ. 
                -- A menu item that has both a label and an icon, is missing one of them.

              ## Output format
                Your output should have the following format:
                It has to contain 2 crucial parts. The analysis and the issues.
                On the analysis part I need a human-readable text which will contain info about the results.
                Example on analysis: Test completed. 2 Critical, 0 Major and 5 Minor issues are found.
                On the issues part I need one line for each issue. Each line should contain 'severity', 'title' and 'description'.
                Example on an issue: {"severity": "Critical", "title": "Missing Save button", "description":"Save button on item 
                titled as 'Create a user' is missing."}

                A complete response should look like :
                {
                  "analysis": "Text as described above",
                  "issues": [
                    {"severity": "", "title": "", "description": ""}  
                  ]
                }

              ## Splitting rule
                Each issue must describe exactly one finding. If a single element has multiple problems, each problem must be 
                reported as its own separate issue. Findings must never be grouped into a single issue.
                Examples:
                1. A button has wrong text AND wrong position. Each of these two problems must be 
                reported as its own separate issue in the issues array. (Findings must not be grouped just because they occur
                on the same element.)
                2. Two different buttons should both contain the text 'Save'. Due to a typo, both show 'Saave' instead. The 
                fact that both elements have the exact same problem must not lead to grouping them into a single issue — they 
                remain two separate issues.
                3. A new paragraph and a new button have both been added to the same section of the page. Even though they 
                appear together and were likely added as part of the same change, they are two distinct elements with two distinct 
                findings — they must be reported as two separate issues.
                4. A paragraph contains several sentences and many words. The paragraph as a whole is one new element, not a collection 
                of new elements (words or sentences). This counts as one issue, not multiple. The internal complexity of a single element 
                does not split it into multiple issues.

              ## Format rules
                Don't give the response as a markdown or a preamble text. Return only valid JSON. The response must be parseable by 
                JSON.parse().
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
    const result = JSON.parse(analysisText);
    return result;
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

