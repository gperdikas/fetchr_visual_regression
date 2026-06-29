const {createBaseline} = require('../../src/create-baseline.js');
const url = 'http://localhost:3000/page1';

async function createPage1Baselines() {
  // login form
  await createBaseline(url, '#login-form', 'test-data/designs/baseline-');
  // create user form
  await createBaseline(url, '#create-user-form', 'test-data/designs/baseline-');
};
createPage1Baselines();