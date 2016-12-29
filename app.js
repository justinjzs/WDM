//16.12.29
const koa = require('koa');
const path = require('path');
const logger = require('koa-logger');
const serve = require('koa-static');
const favicon = require('koa-favicon');
const pages = require('./routes/pages')

const app = koa();


app.use(logger());
app.use(favicon(path.join(__dirname, './public/favicon.ico')));
app.use(serve(path.join(__dirname, './public')));

app.use(pages.routes());


app.use(function *(next) {
  yield next;
  if ( this.body || !this.idempotent ) return;
  this.redirect( '/404.html' )
});

app.listen(3000);
console.log('listening in 3000');