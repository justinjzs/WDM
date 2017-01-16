const app = require('../../app');

const request = require('supertest').agent(app.listen());
const expect = require('chai').expect;

describe('登出测试', () => {
  it('登陆成功,转home页', done => {
    request
      .post('/login')
      .type('form')
      .send({username: 'test', password: 'test'})
      .expect('Location', '/home')
      .expect('Content-Type', /html/)
      .expect(302, done)
  });
  it('登出成功,转登陆页', done => {
    request
      .get('/logout')
      .expect('Location', '/login')
      .expect('Content-Type', /html/)
      .expect(302, done)
  });
})