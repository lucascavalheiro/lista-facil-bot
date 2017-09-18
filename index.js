var express = require('express');
var morgan = require('morgan');
var path = require('path');
var app = express();

var bot = require('./lib/bot/main.js');

function init() {
  process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    // application specific logging, throwing an error, or other logic here
  });
  bot.initBot();
}

init();

app.use(morgan('short'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.listen(80, function () {
  console.log('Listening on port 80');
});
