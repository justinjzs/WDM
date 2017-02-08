const route = require('koa-router')();
const page = require('../controller/page');


route.get(/^\/home(?:\/|$)/, page.home); 

module.exports = route;
