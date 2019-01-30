const puppeteer = require('puppeteer');
const superagent = require('superagent');
const fs = require('fs');
const ora = require('ora');
const argv = require('optimist').argv;
const UA = 'Mozilla/5.0 (Linux; U; Android 8.1.0; zh-cn; BLA-AL00 Build/HUAWEIBLA-AL00) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/8.9 Mobile Safari/537.36';
(async () => {
  const browser = await puppeteer.launch({
    headless: false
  });
  const spinner = ora('Loading unicorns').start()
  const page = await browser.newPage();
  await page.setUserAgent(UA);
  await page.goto(argv.url);
  await page.waitFor(1000);
  const bodyHandle1 = await page.$('body');
  const iframeURL = await page.evaluate(body => {
    return body.querySelector('iframe').src;
  }, bodyHandle1);
  await page.goto(iframeURL);
  await page.waitFor(1000);
  await page.click('a')
  const videoSrc = page.url()
  spinner.text = '下载比较慢，耐心等待'
  const color = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white', 'gray']
  let timer = setInterval(() => {
    spinner.color = color[Math.floor(Math.random() * 9)]
  }, 200)
  superagent
    .get(videoSrc)
    .end((err, res) => {
      fs.writeFile(`${__dirname}/video.mp4`, res.body, function () {
        spinner.succeed('下完啦～～～')
        clearInterval(timer)
        setTimeout(() => {
          process.exit()
        }, 1000)
      });
    })
})();