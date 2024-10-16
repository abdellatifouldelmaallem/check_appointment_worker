// const schedule = require('node-schedule');
// const puppeteer = require('puppeteer');


// async function check_appointement_worker() {
//     const browser = await puppeteer.launch({ headless: false });
//     const page = await browser.newPage();
//     await page.goto('https://prenotami.esteri.it/', { waitUntil: 'networkidle2' });

//     // Enter email and password from environment variables
//     await page.type('#login-email', process.env.USER_EMAIL);
//     await page.type('#login-password', process.env.PASSWORD);

//     // Click the login button
//     await page.click('button[type="submit"]');

//     // Wait for navigation after login
//     await page.waitForNavigation({ waitUntil: 'networkidle0' });

//     try {
//         // Wait for the <a> element containing the text 'Prendre rendez-vous' to appear
//         await page.waitForSelector('a#advanced', { visible: true, timeout: 10000 });

//         // Click the <a> element
//         await page.click('a#advanced');

//         console.log('Clicked the "Prendre rendez-vous" button and navigated to Services page');
//     } catch (error) {
//         console.log('Failed to find or click the "Prendre rendez-vous" button:', error);
//     }
//     // Close the browser after everything is done
//     await browser.close();
// }

require('dotenv').config();
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

// Use stealth plugin to avoid detection
puppeteer.use(StealthPlugin());

async function check_appointement_worker() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // Log network requests and responses for debugging
    page.on('request', request => {
        console.log('Request:', request.url(), request.method());
    });

    page.on('response', response => {
        console.log('Response:', response.url(), response.status());
    });

    try {
        // Navigate to the login page
        await page.goto('https://prenotami.esteri.it/', { waitUntil: 'networkidle2' });

        // Enter email and password from environment variables
        await page.type('#login-email', process.env.USER_EMAIL, { delay: 100 });
        await page.type('#login-password', process.env.PASSWORD, { delay: 100 });

        // Click the login button
        await page.click('button[type="submit"]');

        // Wait for navigation after login
        await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 60000 });

        // Check cookies to verify if the session is established
        const cookies = await page.cookies();
        console.log('Cookies after login:', cookies);

        // Wait for the <a> element containing the text 'Prendre rendez-vous' to appear
        await page.waitForSelector('a#advanced', { visible: true, timeout: 10000 });

        // Click the <a> element
        await page.click('a#advanced');

        console.log('Clicked the "Prendre rendez-vous" button and navigated to Services page');

        // Optionally, wait for the Services page to load and confirm navigation
        await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 60000 });

    } catch (error) {
        console.log('Error during appointment checking:', error);
    } finally {
        // Close the browser after everything is done
        await browser.close();
    }
}



// run the worker
check_appointement_worker().catch((error) => {
    console.error("Error checking :", error);
});