// const express = require('express');
// const bodyParser = require('body-parser');

const autoPlayer = require('./controller/autoplay');

// const app = express();
// const router = express.Router();
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(bodyParser.raw());

console.log('Process node version', process.version);
autoPlayer.play();
// autoPlayer.test();
// router.get('/autoplay', () => {
//   console.log("AAA")
//   autoPlayer.play();
// });

// app.use('/api', router)

// app.use('/', function (req, res) {
//   res.send('Express server running.');
// });

// app.listen(8080, () => {
//   console.log('Express server is running on http://localhost:8080');
// });