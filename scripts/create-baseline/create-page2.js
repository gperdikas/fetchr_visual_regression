const {createBaseline} = require('../../src/create-baseline.js');
const url = 'http://localhost:3000/page2';

async function createPage2Baselines() {
  // create edit user form baseline 
  await createBaseline(url, '#edit-user-form', 'test-data/designs/baseline-');

};
createPage1Baselines();