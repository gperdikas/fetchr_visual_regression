
const toolConfiguration = {
// Per-pixel color tolerance for pixelmatch. 0–1. 0 = strict (any tiny difference counts), 1 = very lenient
  pixelMatchThreshold: 0.05,
// % of differing pixels needed to escalate to AI. 0–100. Below this = PASS, above = AI call
  escalationThreshold: 0.1,
// Browser size in pixels for the screenshots. e.g. desktop 1920x1080, mobile ~390x844
  viewport: {width: 1920, height: 1080},
// true = use the fake mock AI response (no API call, no cost). false = real AI call (needs API key in .env, may incur cost)
  mockFlag: false,
// The AI model the analysis request is sent to
  model: "claude-sonnet-4-6"
}

module.exports = {toolConfiguration};

