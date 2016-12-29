const route = require('koa-router')();
const handler = require('../controller/pages');


route.get('/', handler.index); 

module.exports = route;
