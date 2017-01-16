const route = require('koa-router')();
const api  = require('../controller/api');

route.get('/shareinfo', api.shareInfo) //分享页信息 t   
     .get('/downshare', api.downShare)  //下载分享的文件 t
     


module.exports = route;