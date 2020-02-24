const puppeteer = require('puppeteer');

const URL = 'https://artofjiujitsu.com/';
const URL_PLAYING = 'https://artofjiujitsu.com/academy-library/?filters=1&categories=sparring';

const URL_VIDEO_LINK = 'https://artofjiujitsu.com/library/professor-gui-sparring-aoj-purple-belt-2-18-2020/';

// const info = require('../auth.config');

const getLink = async (pageOffset, videoOffset) => {
  // launch Options
  // defaultViewport: { width : 1227, height : 1636 },
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process'
    ]
  });
  const page = await browser.newPage();

  page.on('dialog', async dialog => {
      await dialog.dismiss();
  });

  try {
      console.log('Start');
      // Dev
      // const { ID, PASSWORD } = info;

      // Public
      const ID = process.env.EMAIL;
      const PASSWORD = process.env.PASS;

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
      console.log('Login');

      await page.goto(`${URL_PLAYING}&pager=${pageOffset}`);
      await page.waitFor(1000);
      console.log('Open video list');
      const articleList = await page.evaluate(() => {
        const articles = Array.from(document.querySelectorAll('#wrapper > main > #archive-plug > .container > #archive-plug-posts > .grid-item > .entry-thumbnail > a'))
        return articles.map((article) => {
          return article.getAttribute('href');
        });
      });

      console.log('Video page link', articleList[videoOffset - 1]);
      
      await page.goto(articleList[videoOffset - 1]);
      await page.waitFor(1000);
      console.log('Open video page');
      await page.waitForSelector('#wrapper > main > .slideshow > .mask > .slideset > .slide > .video > iframe');
      const elementHandle = await page.$('#wrapper > main > .slideshow > .mask > .slideset > .slide > .video > iframe');
      const frame = await elementHandle.contentFrame();
      
      const video = await frame.$eval('#vzaar-media-player', el =>
        Array.from(el.getElementsByTagName('video')).map(e => e.getAttribute("src")
      ));

      console.log('video link', video[0]);
      
      return video[0]; 
  } catch (error) {
      console.log('Error', error);
  } finally {
      browser.close();
  }
};

const test = async () => {
  const browser = await puppeteer.launch({ 
    headless: false,
    args: [
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process'
    ]
  });
  const page = await browser.newPage();

  try {
    await page.goto('http://www.espn.com/login')
    await page.waitForSelector("iframe");
    
    const elementHandle = await page.$('div#disneyid-wrapper iframe');
    const frame = await elementHandle.contentFrame();
    await frame.waitForSelector('[ng-model="vm.username"]');
    const username = await frame.$('[ng-model="vm.username"]');
    await username.type('foo');
    console.log("REST", frame);
  } catch (error) {
    console.log('Error', error);
  } finally {
    browser.close();
  }

}

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

module.exports.getLink = getLink;
module.exports.test = test;