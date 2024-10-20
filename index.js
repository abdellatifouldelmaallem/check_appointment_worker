require('dotenv').config();
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

// Use stealth plugin to avoid detection
puppeteer.use(StealthPlugin());

async function check_appointement_worker() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    try {
        await page.goto('https://prenotami.esteri.it/', { waitUntil: 'networkidle2' });

        await page.type('#login-email', process.env.USER_EMAIL, { delay: 100 });
        await page.type('#login-password', process.env.PASSWORD, { delay: 100 });

        await page.click('button[type="submit"]');

        await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 60000 });
        await page.waitForSelector('a#advanced', { visible: true, timeout: 10000 });
        await page.click('a#advanced');
        console.log('Clicked the "Prendre rendez-vous" button and navigated to Services page');

        await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 60000 });

    } catch (error) {
        console.log('Error during appointment checking:', error);
    } finally {
        await browser.close();
    }
}

// run the worker
check_appointement_worker().catch((error) => {
    console.error("Error checking :", error);
});