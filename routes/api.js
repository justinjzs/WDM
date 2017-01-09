const route = require('koa-router')();
const api  = require('../controller/api');

route.get('/homeinfo', api.homeInfo) //home页信息
     .get('/shareinfo', api.shareInfo) //分享页信息
     .get('/download', api.download) //下载单文件
     .get('/downloadzip', api.downloadzip)  //下载多文件
     .get('/downshare', api.downShare)  //下载分享的文件
     .post('/upload', api.upload)  //上传文件
     .post('/uploaddir', api.uploadDir)  //上传文件夹
     .post('/mkdir', api.mkdir) //新建文件夹
     .post('/share', api.share) // 加入分享
     .post('/saveshare', api.saveShare)//转存
     .put('/rename', api.rename)  //重命名
     .put('/move', api.move) //移动
     .del('/delete', api.delete) //删除
     .del('/unshare', api.unshare); //取消分享



module.exports = route;