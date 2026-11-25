async function takeScreenshot(recipeName) {
    console.log(`This should take a screenshot of ${recipeName}`);
    return 'screenshots/current/fake.png'
}

async function main() {
    const path = await takeScreenshot('login-form');
    console.log('got:', path);
}

main();