const schedule = require('node-schedule');
const http    = require('http')

// real time '*/20 * * * *'
let i = 0;
let n = 3;
const job = schedule.scheduleJob('*/2 * * * * *', ()=>{
    console.count("test")
    i++;
    if (i === n) {
        job.cancel()
    } 
})