const route = require('koa-router')();
const api  = require('../controller/api');

route.use('*', api.parser) //handle error message
     .get('/homeinfo', api.homeInfo) //home页信息 t
     .get('/download', api.download) //下载单文件 t
     .post('/upload', api.upload)  //上传文件 t
     .post('/uploaddir', api.uploadDir)  //上传文件夹
     .post('/mkdir', api.mkdir) //新建文件夹 t
     .post('/share', api.share) // 加入分享 t
     .post('/saveshare', api.saveShare)//转存 t
     .put('/rename', api.rename)  //重命名 t
     .put('/move', api.move) //移动 t
     .del('/delete', api.delete) //删除 t
     .del('/unshare', api.unshare); //取消分享 t



module.exports = route;