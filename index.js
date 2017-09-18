var bot = require('./lib/bot/main.js');

function init() {
  process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    // application specific logging, throwing an error, or other logic here
  });
  bot.initBot();
}

init();
