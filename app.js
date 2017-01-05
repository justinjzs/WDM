const koa = require('koa');
const path = require('path');
const logger = require('koa-logger');
const serve = require('koa-static');
const favicon = require('koa-favicon');
const pages = require('./routes/pages');
const api = require('./routes/api');
const db = require('./controller/db');


const app = koa();


app.use(logger());  //日志
app.use(favicon(path.join(__dirname, './public/favicon.ico'))); //favicon
app.use(serve(path.join(__dirname, './public'))); //静态文件

app.use(db); //连接数据库

app.use(api.routes());    //api路由
app.use(pages.routes()); //页面路由



app.use(function *(next) {
  yield next;
  if ( this.body || !this.idempotent ) return;
  this.redirect( '/404.html' )
});

app.listen(3000);
console.log('listening in 3000');