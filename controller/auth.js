const passport = require('koa-passport')
const query = require('./db').query(); //拿到数据库查询函数

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

  const values = [username, password];
  query(`select u_id from users where u_name = $1 and u_pwd = $2`,
    values,
    (err, result) => {
      if (err) { //数据库错误
        done(err);
        return;
      }
      const user = result.rows[0]; //{ key: [Number] } or undefined
      if(user)  
        done(null, user); //success
      else
        done(null ,false);  //failure    
    })

}))
//github登陆
let GithubStrategy = require('passport-github').Strategy;
passport.use(new GithubStrategy({
  clientID: '717242f80717f651799d',
  clientSecret: '9d246737092a45966ee3af077df789c69de27782',
  callbackURL: 'http://localhost:3000/auth/github/callback'
},
  function(accessToken, refreshToken, profile, done) {
    query(`select u_id from users where u_github = $1`,
    [profile.username],
    (err, result) => {
      if (err) { //数据库错误
        done(err);
        return;
      }
      const user = result.rows[0]; //{ key: [Number] } or undefined
      if(user)    //老用户
        done(null, user); 
      else    //新用户
        query(`insert into users ( u_github ) values ( $1 ) returning u_id`,     
        [profile.username],
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