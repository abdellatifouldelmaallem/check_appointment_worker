const schedule = require('node-schedule');
const puppeteer = require('puppeteer');
require('dotenv').config();

async function check_appointement_worker() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://prenotami.esteri.it/', { waitUntil: 'networkidle2' });

    // Enter email and password from environment variables
    await page.type('#login-email', process.env.USER_EMAIL);
    await page.type('#login-password', process.env.PASSWORD);

    // Click the login button
    await page.click('button[type="submit"]');

    // Wait for navigation after login
    await page.waitForNavigation({ waitUntil: 'networkidle0' });

    try {
        // Wait for the <a> element containing the text 'Prendre rendez-vous' to appear
        await page.waitForSelector('a#advanced', { visible: true, timeout: 10000 });

        // Click the <a> element
        await page.click('a#advanced');

        console.log('Clicked the "Prendre rendez-vous" button and navigated to Services page');
    } catch (error) {
        console.log('Failed to find or click the "Prendre rendez-vous" button:', error);
    }
    // Close the browser after everything is done
    await browser.close();
}


// run the worker
check_appointement_worker().catch((error) => {
    console.error("Error checking :", error);
});