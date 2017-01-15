const route = require('koa-router')();
const passport = require('koa-passport');
require('../controller/auth');

//账号密码登陆
route.post('/login',
  passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/login'
  })
  );
//注册
route.post('/signup',
  passport.authenticate('signup', {
    successRedirect: '/home',
    failureRedirect: '/signup'
  })
);
//登出
route.get('/logout', function *() {
  this.logout();
  this.redirect('/login');
});
//github登陆
route.get('/auth/github',
  passport.authenticate('github')
);

route.get('/auth/github/callback', 
  passport.authenticate('github', {
    successRedirect: '/home',
    failureRedirect: '/'
  })
);

module.exports = route;