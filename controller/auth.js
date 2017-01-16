const passport = require('koa-passport')
const query = require('./db').query(); //拿到数据库查询函数
const crypto = require('crypto');

//data ---> session
passport.serializeUser(function(user, done) {

  done(null, user.u_id)
})
//session ----> data
passport.deserializeUser(function(u_id, done) {
  query( `select u_id, u_name from users where u_id = $1`,
    [u_id],
    (err, result) => {
      if (err) { //数据库错误
        done(err);
        return;
      }
      done(null, result.rows[0]);
    });
})
//本地登陆
let LocalStrategy = require('passport-local').Strategy
passport.use(new LocalStrategy(function(username, password, done) {
  const hash = crypto.createHash('sha1');
  hash.update(password);
  const values = [username, hash.digest('hex')];
  //查询数据库
  query(`select u_id from users where u_name = $1 and u_pwd = $2`,
    values,
    (err, result) => {
      if (err) return done(err);
      const user = result.rows[0]; //{ key: [Number] } or undefined
      if(user)  
        done(null, user); //success
      else
        done(null ,false);  //failure    
    })

}))
//本地注册
passport.use('signup', new LocalStrategy(function(username, password, done) {
  const hash = crypto.createHash('sha1');
  hash.update(password);
  const values = [username, hash.digest('hex')];
  //查询是否重复
  query(`select u_id from users where u_name = $1`,
  [username],
  (err, result) => {
    if (err) return done(err);
    const user = result.rows[0];
    if(user)
      done(null, false); //重复，注册失败
    else
      query(`insert into users (u_name, u_pwd) values ($1, $2) returning u_id `,  
      values,
      (err, result) => {
        if (err) return done(err);
        const user = result.rows[0];
        if(user)
          done(null, user);
        else
          done(null, false);
      });

  });
}))

//github登陆
let GithubStrategy = require('passport-github').Strategy;
passport.use(new GithubStrategy({
  clientID: '717242f80717f651799d',
  clientSecret: '9d246737092a45966ee3af077df789c69de27782',
  callbackURL: 'http://localhost:3000/auth/github/callback'
},
  function(accessToken, refreshToken, profile, done) {
    query(`select u_id from users where u_gitId = $1`,
    [+profile.id],
    (err, result) => {
      if (err) { //数据库错误
        done(err);
        return;
      }
      const user = result.rows[0]; //{ u_id: [Number] } or undefined
      if(user)    //老用户
        done(null, user); 
      else    //新用户
        query(`insert into users ( u_gitId, u_gitName ) values ( $1, $2 ) returning u_id`,     
        [+profile.id, profile.username],
        (err, result) => {
          if (err) {
            done(err);
            return;
          }
          done(null, result.rows[0]); //把user传出
        })     
    });
  }
))

let GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
passport.use(new GoogleStrategy({
  clientID: "941570385690-1jc6fm91oud5glts4t75nmers0fm640f.apps.googleusercontent.com",
  clientSecret: "w7huTARpWkvh7aE86za37dTX",
  callbackURL: "http://localhost:3000/auth/google/callback"
}, 
function(accessToken, refreshToken, profile, done) {
  query(`select u_id from users where u_googleId = $1`,
    [+profile.id],
    (err, result) => {
      if (err) { //数据库错误
        done(err);
        return;
      }
      const user = result.rows[0]; //{ u_id: [Number] } or undefined
      if (user)    //老用户
        done(null, user);
      else    //新用户
        query(`insert into users ( u_googleId, u_googleName ) values ( $1, $2 ) returning u_id`,
          [+profile.id, profile.displayName],
          (err, result) => {
            if (err) {
              done(err);
              return;
            }
            done(null, result.rows[0]); //把user传出
          })
    });

}))