const route = require('koa-router')();
const api  = require('../controller/api');

route.get('/home/:key', download) //下载
     .post('/home', switchPost)  //上传/新建文件夹
     .put('/home/:key', switchPut)  //移动/重命名
     .del('/home/:key', switchDel); //删除

function *download() {
  this.body = "download";
}

function *switchPut() {
  this.body = 'switchPut';
}

function *switchDel() {
  this.body = "switchDel";
}

function *switchPost() {
  api.upLoad(this);
}

module.exports = route;