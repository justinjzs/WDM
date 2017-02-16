const route = require('koa-router')();
const api  = require('../controller/api');

route.use('*', api.parser) //handle error message
     .get('/homeinfo', api.homeInfo) //home页信息 t Graphql
     .get('/download', api.download) //下载单文件 t X
     .post('/upload', api.upload)  //上传文件 t X
     .post('/uploaddir', api.uploadDir)  //上传文件夹 X
     .post('/mkdir', api.mkdir) //新建文件夹 t Graphql
     .post('/addshare', api.addShare) // 加入分享 t
     .post('/saveshare', api.saveShare)//转存 t
     .put('/rename', api.rename)  //重命名 t Graphql
     .put('/move', api.move) //移动 t Graphql
     .del('/delete', api.delete) //删除 t Graphql
     .del('/unshare', api.unshare); //取消分享 t



module.exports = route;