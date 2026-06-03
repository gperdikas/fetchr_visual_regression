const {compareImages} = require('../src/compare-images.js');

async function runCompare() {
  const result = await compareImages(
    'test-data/designs/dummy-baseline.png',
    'test-data/screenshots/dummy-current.png'
  );
  console.log(result);
};

runCompare();