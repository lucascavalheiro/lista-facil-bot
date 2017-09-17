// Bot API: https://core.telegram.org/bots/api

var bot;
const botUsername = '@ListaFacilBot';
var list = [];

module.exports = {
  initBot: function() {
    const TelegramBot = require('node-telegram-bot-api');

    // replace the value below with the Telegram token you receive from @BotFather
    const token = '416930779:AAEwWdV5VXz9MJgp-OEGh-lXuK-9mMKKr14';

    // Create a bot that uses 'polling' to fetch new updates
    bot = new TelegramBot(token, {polling: true});

    // Matches "/add[whatever]"
    bot.onText(/\/add/, (msg, match) => {
      // 'msg' is the received Message from Telegram
      // 'match' is the result of executing the regexp above on the text content
      // of the message
      const item = getItemFromMessage(match[1]); // the captured "whatever"
      if (item)
        addItemToList(msg, item);
      else
        replyAddItemToList(msg);
    });

    // Matches "/showlist[whatever]"
    bot.onText(/\/showlist(.+)/, (msg, match) => {
      // 'msg' is the received Message from Telegram
      showList(msg);
    });

    // Matches "/showlist[whatever]"
    bot.onText(/\/remove(.+)/, (msg, match) => {
      // 'msg' is the received Message from Telegram
      const item = getItemFromMessage(match[1]); // the captured "whatever"
      removeItem(msg, item);
    });

    // Listen for any kind of message. There are different kinds of
    // messages.
    // bot.on('message', (msg) => {
    //   const chatId = msg.chat.id;
    //
    //   // send a message to the chat acknowledging receipt of their message
    //   bot.sendMessage(chatId, 'Received your message: ' + msg);
    // });
  }
}

function getItemFromMessage(message) {
  // remove @ListFacilBot from message
  if (message && message.startsWith(botUsername)) {
    return message.substring(botUsername.length, message.length).trim();
  }
  return message
}

function addItemToList(msg, item) {
  const chatId = msg.chat.id;
  const messageId = msg.message_id;

  list.push(item);

  const resp = `Pode deixar, adicionei <b>${item}</b> na lista!`;

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp, {
    'parse_mode': 'HTML',
    'reply_to_message_id': messageId
  });
}

function replyAddItemToList(msg) {
  const chatId = msg.chat.id;
  var opts = {
  reply_markup: JSON.stringify(
    {
      force_reply: true,
      keyboard: [['Over 18'],['Under 18']]
    }
  )};
  bot.sendMessage(chatId, 'How old are you?', opts)
}

function showList(msg) {
  const chatId = msg.chat.id;
  const messageId = msg.message_id;
  var resp = '';

  if (list.length === 0) {
    resp = `Parece que sua lista ta vazia :(, digite <i>/additem</i> para adicionar seu primeiro item!)`;
  }
  else {
    resp = `Ta aqui a lista:${list.map((item, index) => {
      return `\r\n${index + 1}. ${item}`;
    })}`;
  }
  bot.sendMessage(chatId, resp, {
    'parse_mode': 'HTML',
    'reply_to_message_id': messageId
  });
}

function removeItem(msg, item) {
  const chatId = msg.chat.id;
  const messageId = msg.message_id;
  var resp = '';

  if (list.length === 0) {
    resp = `Sua lista já está vazia! Primeiro adicione um item nela usando o comando <i>/add</> para depois remover`;
  }
  else if (isNaN(+item) || list[item - 1] === undefined) {
    resp = `Não achei nenhum item '${item}' :(. Tenta assim: <i>/remove 1</i>)`;
  }
  else {
    let listItem = list[item - 1];
    list.splice(item - 1, 1);
    resp = `Pode deixar, removi o item <b>${listItem}</b> da sua lista!`;
  }
  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp, {
    'parse_mode': 'HTML',
    'reply_to_message_id': messageId
  });
}
