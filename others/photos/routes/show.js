const render = require('../lib/render');
const route = require('koa-router')();
const parse = require('co-busboy');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types')
const formParse = require('co-body');


var photos = [];//stored photos
let users = {}; //stored users


route.get('/', list) //index.html
     .get('/register', getRegis) //show register page
     .post('/register', postRegis)//handle register post
     .get('/login', getLogin) //show login page
     .post('/login', postLogin) //handle login post
     .get('/logout', getLogout) //logout
     .get('/upload', getUpload) //upload page
     .post('/upload', postUpload) //handle uploading
     .get('/:id/download', download); //handle photos downloads

function *list() {
  let messages = this.session.messages || {};
  this.body = yield render('list', {title: 'photos', photos, messages});
}

function *getRegis() {
  let warning = this.cookies.get('register'); //读取cookies
  const opts = { expires: new Date(1), path: '/' };//清除cookies
  this.cookies.set('register', '', opts);
  this.body = yield render('register', {title: 'Register', warning});
}

function *postRegis() {
  let body = yield formParse(this);
  if( body.user in users) {
    this.cookies.set('register', 'Username already taken!');
    this.redirect('/register'); //重定向并设置cookies
  } else {
    users[body.user] = body.pass;//{123: '321'}
    this.session.messages = this.session.messages || {};
    this.session.messages.name = body.user; //{name：'123'}
    this.redirect('/');
  }
}

function* getLogin() {
  let warning = this.cookies.get('login'); //读取cookies
  const opts = { expires: new Date(1), path: '/' };//清除cookies
  this.cookies.set('login', '', opts);
  this.body = yield render('login', {title: 'Login', warning});
}

function* postLogin() {
  let body = yield formParse(this);
  let user = { name: body.user, pass: body.pass };
  if (users[body.user] != body.pass) {
    this.cookies.set('login', 'Either username or password error');
    this.redirect('/login'); //重定向并设置cookies
  } else {
    this.session.messages = this.session.messages || {};
    this.session.messages.name = body.user; //{name：'jin'}
    this.redirect('/');
  }
}

function *getLogout() {
  const opts = {expires: new Date(1), path: '/'};
  this.cookies.set('koa:sess', '', opts);
  this.cookies.set('koa:sess.sig', '', opts);
  this.redirect('/');
}

function *getUpload() {
  this.body = yield render('upload', {title: 'Photos Upload'});
}

function *postUpload() {
  var parts = parse(this,{autoFields: true});
  var part;

  while((part = yield parts)) {
    let stream = fs.createWriteStream(path.join(__dirname, '../public/photos/' + part.filename));
    photos.push({name: parts.field.name || part.filename, path: part.filename});
    part.pipe(stream);
    console.log('the dir is ' + stream.path);
  }

  this.redirect('/');
}

function *download() {
  let urlArr = this.url.split('/');//获取id
  const id = +urlArr[1];
  this.body = fs.createReadStream(path.join(__dirname , '../public/photos/' + photos[id].path));
  this.set('Content-disposition', 'attachment; filename=' + photos[id].name);
  console.log(mime.lookup(photos[id].path));
  this.set('Content-type', mime.lookup(photos[id].path));
}

module.exports = route.routes();