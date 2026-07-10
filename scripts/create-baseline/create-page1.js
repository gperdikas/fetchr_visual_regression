const {createBaseline} = require('../../src/create-baseline.js');
const url = 'http://localhost:3000/page1';

async function createPage1Baselines() {
  await createBaseline(url, '#login-form', 'test-data/designs/baseline-');
  await createBaseline(url, '#create-user-form', 'test-data/designs/baseline-');
  const loginFontSteps = async(page) => {
    await page.click('#login-email-inputbox');
    await page.keyboard.type('ABCabc123');
  }
  await createBaseline(url, '#login-email-inputbox', 'test-data/designs/baseline-', loginFontSteps);
  const createUserFontSteps = async(page) => {
    await page.click('#create-user-first-inputbox');
    await page.keyboard.type('ABCabc123');
  }
  await createBaseline(url, '#create-user-first-inputbox', 'test-data/designs/baseline-', createUserFontSteps);
};
createPage1Baselines();

