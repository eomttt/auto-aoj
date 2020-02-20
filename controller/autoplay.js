const puppeteer = require('puppeteer');

const URL = 'https://artofjiujitsu.com/';
const URL_PLAYING = 'https://artofjiujitsu.com/academy-library/?filters=1&categories=competition,seminars,sparring';

const info = require('../auth.config');

const play = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width : 1227, height : 1636 }
  });
  const page = await browser.newPage();

  page.on('dialog', async dialog => {
      await dialog.dismiss();
  });

  try {
      const { ID, PASSWORD } = authInfo;
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

      return 'Success'
  } catch (error) {
      console.log('Error', error);
  } finally {
      // browser.close();
  }
};

module.exports.play = play;