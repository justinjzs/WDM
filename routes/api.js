const route = require('koa-router')();

route.get('/home/:key', download) //下载
     .post('/home/')
     .put('/home/:key', switchPut)  //移动/重命名
     .del('/home/:key', switchDel); //