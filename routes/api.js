const route = require('koa-router')();
const api  = require('../controller/api');

route.get('/download', api.download) //下载
     .post('/upload', api.upload)  //上传
     .post('/new', api_New)//新建文件夹
     .put('/rename', api.rename)  //重命名
     .put('/move', api_Move) //移动
     .del('/delete', api_Delete); //删除

function *api_New() {
  this.body = "switchDel";
}


function *api_Move() {

}

function *api_Delete() {

}

module.exports = route;