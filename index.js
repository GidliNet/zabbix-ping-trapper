const ping = require("net-ping");
const cron = require("cron");
const puppeteer = require("puppeteer")
const session = ping.createSession({
  networkProtocol: ping.NetworkProtocol.IPv4,
  packetSize: 16,
  retries: 1,
  sessionId: process.pid % 65535,
  timeout: 2000,
  ttl: 128,
});

// cron.CronJob.from({
//   cronTime: "*/1 * * * * *",
//   onTick: function () {
//     session.pingHost("192.168.191.93", function (error, target, sent, rcvd) {
//       console.log(error, target, rcvd - sent);
//     });
//   },
//   start: true,
// });


// const speedTest=require("speedtest-net")

// speedTest({acceptLicense: true}).then((data)=>{
// console.log(data)
// })

async function start(){
    const browser=await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://google.com",{waitUntil:"networkidle0"})
    await page.setViewport({
        width:1080,
        height:1024
    })
   await page.screenshot({
        path:"lazy.png"
    })
    
}
start()