const app = require('../../../app');

const request = require('supertest').agent(app.listen());
const expect = require('chai').expect;

// let session;
// session = res.headers['set-cookie'].map( cookie => 
//   cookie.split(';').shift() 
// ).join('; ') ;

describe('登录测试', () => {
  it('未登录，请求/home失败', done => {
    request
      .get('/home')
      .expect('Location', '/login')
      .expect('Content-Type', /html/)
      .expect(302, done)
  })

  it('登陆成功,重定向', done => {
    request
      .post('/login')
      .type('form')
      .send({username: 'test', password: 'test'})
      .expect('Location', '/home')
      .expect('Content-Type', /html/)
      .expect(302, done)
  });
  
  it('已登录，请求/home成功', done => {
    request
      .get('/home')
      .expect('Content-Type', /html/)
      .expect(200, done)
  })
})