const koa = require('koa');
const path = require('path');
const parse = require('co-body');
const render = require('./lib/render');
const logger = require('koa-logger');
const serve = require('koa-static');
const show = require('./routes/show');
const favicon = require('koa-favicon');
const session = require('koa-session');

const app = koa();

app.use(logger());//log 
app.use(favicon(path.join(__dirname, './public/qiu.jpg')))
app.use(serve(path.join(__dirname, './public'))); //serve static pages

app.keys = ['key1', 'key2'];
app.use(session(app));

app.use(function *(next) {
  yield next;
  if (this.body || !this.idempotent) return;
  this.redirect('/404.html');
});

app.use(show);






app.listen(3000);
console.log('listening in 3000');


