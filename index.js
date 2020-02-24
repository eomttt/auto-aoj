const express = require('express');
const bodyParser = require('body-parser');

const autoPlayer = require('./controller/autoplay');

const app = express();
const router = express.Router();
const PORT = process.env.PORT;

console.log('Process node version', process.version);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.set('views', __dirname + '/views');

// 기본 path를 /public으로 설정(css, javascript 등의 파일 사용을 위해)
app.use(express.static(__dirname + '/public'));

app.use('/api', router);
app.use('/', function (req, res) {
  res.send('index.html');
});

router.get('/autoplay', async (req, res) => {
  try {
    const { page, video } = req.query;
    const link = await autoPlayer.getLink(page, video);
    res.send(link);
  } catch (error) {
    console.log('Auto play error', error);
  }
});

app.listen(PORT || 5000, () => {
  console.log(`Express server is running on http://localhost:${PORT || 8000}`);
});