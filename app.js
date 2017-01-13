const koa = require('koa');
const path = require('path');
const logger = require('koa-logger');
const serve = require('koa-static');
const methodOverride = require('koa-methodoverride');
const favicon = require('koa-favicon');
const page = require('./routes/page');
const authPage = require('./routes/authpage');
const api = require('./routes/api');
const auth = require('./routes/auth')
const db = require('./controller/db').middleware;
const bodyParse = require('./controller/bodyparse');
const bodyParser = require('koa-bodyparser');
const session = require('koa-generic-session');
const passport = require('koa-passport');

const app = module.exports = koa();

app.use(logger());  //日志
app.use(favicon(path.join(__dirname, './public/favicon.ico'))); //favicon
app.use(serve(path.join(__dirname, './public'))); //静态文件

app.use(db); //连接数据库
app.use(bodyParser()); //解析请求体
//session
app.keys = ['secret']
app.use(session())
//authentication
app.use(passport.initialize())
app.use(passport.session())

app.use(methodOverride('_method')); //重写method

app.use(page.routes()); //页面路由
app.use(auth.routes());

app.use(function*(next) { //
  if (this.isAuthenticated()) {
    yield next
  } else {
    this.redirect('/login');
  }
})

app.use(authPage.routes());
app.use(api.routes());    //api路由

app.use(function *(next) {
  yield next;
  if ( this.body || !this.idempotent ) return;
  this.redirect( '/404.html' )
});

app.listen(3000);
console.log('listening in 3000');