const route = require('koa-router')();
const page = require('../controller/page');


route.get('/', page.index)
     .get('/login', page.login)
     .get('/signup', page.signup)
     .get('/share', page.share);

module.exports = route;
