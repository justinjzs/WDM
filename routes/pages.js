const route = require('koa-router')();
const pages = require('../controller/pages');


route.get('/', pages.index); 

module.exports = route;
