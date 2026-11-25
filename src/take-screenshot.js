async function takeScreenshot(recipeName) {
    console.log(`This should take a screenshot of ${recipeName}`);
    return 'screenshots/current/fake.png'
}

module.exports = {takeScreenshot};