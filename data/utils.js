var WeDeploy = require('wedeploy');

module.exports = {
  createList: async function(chatId, items) {
    return new Promise((resolve, reject) => {
      WeDeploy
        .data(process.env.DATA_URL)
        .create('lists', {
          chat_id: chatId,
          items: items })
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  /**
  * Return a list by chat id
  */
  getListById: async function(chatId) {
    return new Promise((resolve, reject) => {
      console.log('getListById');
      WeDeploy
        .data(process.env.DATA_URL)
        .where('chat_id', '=', chatId)
        .get('lists')
        .then(data => {
          console.log('result', data);
          resolve(data);
        })
        .catch(error => {
          console.log('error', error);
          reject(error);
        });
    });

  },
  /**
  *
  */
  removeList: async function() {
    return new Promise((resolve, reject) => {
      WeDeploy
        .data(process.env.DATA_URL)
        .delete('lists')
        .then(data => {
          resolve(data);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
}
