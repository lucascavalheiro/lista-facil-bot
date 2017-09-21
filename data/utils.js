var WeDeploy = require('wedeploy');

module.exports = {
  createList: async function(chatId, items) {
    console.log('createList');
    return new Promise((resolve, reject) => {
      WeDeploy
        .data(process.env.DATA_URL)
        .create('lists', {
          chat_id: chatId,
          items: items })
        .then(response => {
          console.log('created');
          resolve(response);
        })
        .catch(error => {
          console.log('error', error);
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
      console.log('removeList');
      WeDeploy
        .data(process.env.DATA_URL)
        .delete('lists/246401605023582646')
        .then(data => {
          console.log('removeAll success');
          resolve(data);
        })
        .catch(error => {
          console.log('removelAll failed');
          reject(error);
        });
    });
  },
  /**
  *
  */
  addItemToList: async function(chatId, item) {
    //let currentItems = createList
  },
  /**
  *
  */
  clearList: async (chatId) => {
    return new Promise((resolve, reject) => {
      WeDeploy
        .data(process.env.DATA_URL)
        .update(`lists/246402013528188958/items`, {})
        .then(response => {
          console.log('clear success', response);
          resolve(response);
        })
        .catch(error => {
          console.log('clear fail', response);
          reject(error);
        })
    })
  }
}
