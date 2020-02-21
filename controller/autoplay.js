const puppeteer = require('puppeteer');

const URL = 'https://artofjiujitsu.com/';
const URL_PLAYING = 'https://artofjiujitsu.com/academy-library/?filters=1&categories=competition,seminars,sparring&instructors=rafael-mendes,gui-mendes&pager=1';

const URL_VIDEO_LINK = 'https://artofjiujitsu.com/library/professor-gui-sparring-aoj-purple-belt-2-18-2020/';

const info = require('../auth.config');

const play = async () => {
  let pageOffset = 1;
  let videoOffset = 1;

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width : 1227, height : 1636 }
  });
  const page = await browser.newPage();

  page.on('dialog', async dialog => {
      await dialog.dismiss();
  });

  try {
      const { ID, PASSWORD } = info;
      await page.goto(URL);
      await page.waitFor(1000);
      
      await page.click('#wrapper > #header > .holder > .nav-drop > #nav > #menu-item-1008');
      await page.waitFor(1000);
      
      await page.evaluate((id, password) => {
        document.querySelector('#wrapper > #header > .holder > .nav-drop > #nav > #menu-item-1008 > #modalLogin > .modal-body > #login-form > .form-group > #username').value = id;
        document.querySelector('#wrapper > #header > .holder > .nav-drop > #nav > #menu-item-1008 > #modalLogin > .modal-body > #login-form > .form-group > #pwd').value = password;
        document.querySelector('#wrapper > #header > .holder > .nav-drop > #nav > #menu-item-1008 > #modalLogin').style.display = 'block';
      }, ID, PASSWORD);

      await page.click('#wrapper > #header > .holder > .nav-drop > #nav > #menu-item-1008 > #modalLogin > .modal-body > #login-form > .form-group > #sign-in-btn');
      await page.waitFor(1000);

      await page.goto(URL_PLAYING);

      const articleList = await page.evaluate(() => {
        const articles = Array.from(document.querySelectorAll('#wrapper > main > #archive-plug > .container > #archive-plug-posts > .grid-item > .entry-thumbnail > a'))
        return articles.map((article) => {
          return article.getAttribute('href');
        });
      });

      await page.waitFor(1000);

      await page.goto(articleList[0]);
      await page.waitForSelector("iframe");
      const elementHandle = await page.$('div#wrapper iframe');
      const frame = await elementHandle.contentFrame();
      // const src = await frame.querySelector('#vzaar-media-player > .vzaar-player-wrapper > .video-js > video').getAttribute('src');
  
      // await page.waitForSelector('iframe');
      // const elementHandle = await page.$('#wrapper > main > .slideshow > .mask > .slideset > .slide > .video > iframe');
      // console.log('elementHandle', elementHandle);
      // const frame = await elementHandle.contentFrame();
      // await frame.waitForSelector('#vzaar-media-player > .vzaar-player-wrapper > .video-js > video');
      // const res = await frame$('#vzaar-media-player > .vzaar-player-wrapper > .video-js > video');
      console.log("RES", frame);
      return 'Success'
  } catch (error) {
      console.log('Error', error);
  } finally {
      browser.close();
  }
};

const playVide = async (link = URL_VIDEO_LINK) => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width : 1227, height : 1636 }
  });
  const page = await browser.newPage();

  page.on('dialog', async dialog => {
      await dialog.dismiss();
  });
};

module.exports.play = play;