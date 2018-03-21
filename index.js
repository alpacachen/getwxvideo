const puppeteer = require('puppeteer');
const superagent = require('superagent');
const fs = require('fs');
const argv = require('optimist').argv;
const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1';
const timer = Date.now();
(async () => {
  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();
  await page.setUserAgent(UA);
  await page.goto(argv.url);
  await page.waitFor(1000);
  const bodyHandle1 = await page.$('body');
  const videoURL = await page.evaluate(body => {
    return body.querySelector('.video_iframe').src;
  }, bodyHandle1);
  await page.goto(videoURL);
  const bodyHandle2 = await page.$('body');
  const videoSrc = await page.evaluate(body => body.querySelector('a').href, bodyHandle2);
  superagent
    .get(videoSrc)
    .end((err,res)=>{
      fs.writeFile(`${__dirname}/video.mp4`,res.body,function(){
        console.log('video has download')
        process.exit()
      });
    })
})();