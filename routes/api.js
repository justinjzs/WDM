const route = require('koa-router')();
const api  = require('../controller/api');

route//.get('/home', api.home) //文件信息
     .get('/download', api.download) //下载
     .post('/upload', api.upload)  //上传
     .post('/mkdir', api.mkdir)//新建文件夹
     .put('/rename', api.rename)  //重命名
     .put('/move', api.move) //移动
     .del('/delete', api.delete); //删除



module.exports = route;