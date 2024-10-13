const schedule = require('node-schedule');
const http    = require('http')
const puppeteer = require('puppeteer');
require('dotenv').config();

// real time '*/20 * * * *'
// let i = 0;
// let n = 3;
// const job = schedule.scheduleJob('*/2 * * * * *', ()=>{
//     console.count("test")
//     i++;
//     if (i === n) {
//         job.cancel()
//     } 
// })

async function check_appointement_worker(){
    const browser = await puppeteer.launch({ headless: false, slowMo: 500});
    const page = await browser.newPage();
    await page.goto('https://prenotami.esteri.it/', { waitUntil: 'networkidle2' });

    // Enter email and password from environment variables
    await page.type('#login-email', process.env.USER_EMAIL);
    await page.type('#login-password', process.env.PASSWORD);

    // Click the login button
    await page.click('button[type="submit"]');

    // Wait for navigation after login
    await page.waitForNavigation();
    let img = page.$('img');
    if (img) {
        const imageSrc = await page.evaluate(img => img.src, firstImageElement);
        console.log('First image source:', imageSrc);
    } else {
        console.log('No image found on the page.');
    }

     // Close the browser
     await browser.close();
}

// run the worker
check_appointement_worker().catch((error) => {
    console.error("Error checking :", error);
});