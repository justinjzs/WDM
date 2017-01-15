const views = require('co-views');
const path = require('path');
//const fs = require('co-fs');

const render =  views(path.join(__dirname, '../views'), {
  map: {html: 'ejs'}
}); //渲染引擎


module.exports = {
  index: function *() {
    this.body = yield render('index');
  },

  home: function *() {
    this.body = yield render('home');
  },

  login: function *() {
    this.body = yield render('login');
  },

  signup: function *() {
    this.body = yield render('signup');
  }
}
