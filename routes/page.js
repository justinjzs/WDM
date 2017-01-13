const route = require('koa-router')();
const page = require('../controller/page');


route.get('/', page.index)
     .get('/login', page.login);

module.exports = route;
