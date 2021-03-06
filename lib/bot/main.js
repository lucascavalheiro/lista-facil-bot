var Bot = require('telegram-api').default;
var Message = require('telegram-api/types/Message');
var Question = require('telegram-api/types/Question');
var Keyboard = require('telegram-api/types/Keyboard');
var File = require('telegram-api/types/File');
var DataUtils = require('../../data/utils');

var bot;
const botUsername = '@ListaFacilBot';
var list = [];

module.exports = {
  initBot: async function() {

    bot = new Bot({
      token: process.env.TOKEN_BOT
    });

    if (process.env.IS_LOCAL === true) {
      bot.start();
    }
    else {
      bot.start({
        url: process.env.HOST,
        port: process.env.PORT,
        server: ''
      });
    }
    try {
      let result = await DataUtils.getListById(1);
      if (result.length === 0) {
        console.log('result empty');
      }
      await DataUtils.createList(1, {a: 1, b: 2});
      //await DataUtils.removeList();
      await DataUtils.clearList();
    }
    catch(error) {
      console.log(error);
    }
    console.log('after all')

    bot.command('add ...param', function(message) {
      const { args: { param: item } } = message;
      if (item === undefined) {
        questionAddItem(message);
      }
      else
        addItemToList(message, item);
    });

    bot.command('list', function(message) {
      showList(message);
    });

    bot.command('remove <number> ...itemList', function(message) {
      const { args: { number: item, itemList } } = message;
      if (item !== undefined) {
        let itemsToRemove = item;
        if (itemList !== undefined)
          itemsToRemove = `${item} ${itemList}`;
        removeItem(message, itemsToRemove);
      }
    });
  }
}







function addItemToList(msg, item) {
  const chatId = msg.chat.id;
  const messageId = msg.message_id;

  list.push(item);

  const resp = `Pode deixar, adicionei <b>${item}</b> na lista! ✍️`;
  var reply = new Message().text(resp).html().to(chatId);
  reply.properties.reply_to_message_id = messageId;
  bot.send(reply);
}

function questionAddItem(msg, item) {
  const chatId = msg.chat.id;
  const messageId = msg.message_id;

  var text = 'Digite o item para eu adicionar na lista.\r\nDigite /done quando terminar';
  if (item !== undefined) {
    list.push(item);
    text = `Pode deixar, adicionei <b>${item}</b> na lista! ✍️\r\nDigite /done quando terminar`;
  }

  const kb = new Keyboard()
                  .resize(true)
                  .oneTime(true)
                  .selective(true);
  var reply = new Message().keyboard(kb);
  reply.properties = {
    chat_id: chatId,
    reply_to_message_id: messageId,
    text: text,
    parse_mode: 'HTML',
  }
  reply._keyboard.properties.force_reply = true;

  bot.send(reply).then(answer => {
    if (answer.text.toLowerCase() !== '/done')
      questionAddItem({
        message_id: answer.reply_to_message.message_id,
        chat: {
          id: chatId
        }
      }, answer.text);
  }, answer => {
    console.log('Invalid:', answer.text);
  });;
}

function showList(msg) {
  const chatId = msg.chat.id;
  const messageId = msg.message_id;
  var text = '';

  if (list.length === 0) {
    text = `Parece que sua lista ta vazia, digite /add para começar a adicionar itens!)`;
  }
  else {
    text = `Ta aqui a lista:${list.map((item, index) => {
      return `\r\n${index + 1}. ${item}`;
    })}`;
  }

  var reply = new Message();
  reply.properties = {
    chat_id: chatId,
    reply_to_message_id: messageId,
    text: text,
    parse_mode: 'HTML',
  }
  bot.send(reply);
}

function removeItem(msg, item) {
  const chatId = msg.chat.id;
  const messageId = msg.message_id;
  let text = '';

  const itemList = item.trim().split(/ |\,|\;/);

  // empty list
  if (list.length === 0) {
    text = `Sua lista já está vazia!`;
  }
  // Remove multiple items at once
  else if (itemList.length > 0) {
    let removedItems = [];
    let copyList = list.filter((element, index) => {
      let notFound = itemList.every(i => {
        return (i - 1) !== index;
      });
      if (!notFound && list[index] !== undefined) {
        let listItem = list[index];
        removedItems.push(listItem);
        return false;
      }
      return true;
    });
    list = [...copyList];
    text = `Removi os seguintes itens da sua lista: <b>${removedItems.join(', ')}</b>`
  }
  // Value is not a valid input
  else if (isNaN(+item) || list[item - 1] === undefined) {
    text = `Não achei nenhum item '${item}' :(. Tenta assim: /remove 1)`;
  }
  // Remove one item
  else {
    const listItem = list[item - 1];
    list.splice(item - 1, 1);
    text = `Pode deixar, removi o item <b>${listItem}</b> da sua lista!`;
  }

  var reply = new Message();
  reply.properties = {
    chat_id: chatId,
    reply_to_message_id: messageId,
    text: text,
    parse_mode: 'HTML',
  }
  bot.send(reply);
}
