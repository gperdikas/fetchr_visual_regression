const {takeScreenshot} = require('./take-screenshot.js');
const {compareImages} = require('./compare-images.js');

async function main() {
    const currentPath = await takeScreenshot('login-form');
    const diff = await compareImages('screenshots/baseline/login-form.png', currentPath);
    console.log('diff:', diff);
}
main();