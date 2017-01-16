const app = require('../../app');

const request = require('supertest').agent(app.listen());
const expect = require('chai').expect;


describe('获取文件信息', function () {
  it('登陆', done => {
    request
      .post('/login')
      .type('form')
      .send({ username: 'test', password: 'test' })
      .expect('Location', '/home')
      .expect('Content-Type', /html/)
      .expect(302)
      .end((err, res) => {
        if (err) return done(err);
        Cookies = res.headers['set-cookie'].map(cookie =>
          cookie.split(';').shift()
        ).join('; ');
        done();
      })
  });
  it('响应格式为json', function (done) {
    request
      .get('/homeinfo')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('对象拥有的属性', function (done) {
    request
      .get('/homeinfo')
      .expect(200)
      .end((err, res) => {
        if(err) return done(err);
        if(!res.body.length) { //数组为空，无任何文件
          return done();
        }else {
          expect(res.body[0]).to.have.property('key');
          expect(res.body[0]).to.have.property('name');
          expect(res.body[0]).to.have.property('path');
          expect(res.body[0]).to.have.property('createtime');
          expect(res.body[0]).to.have.property('lasttime');
          expect(res.body[0]).to.have.property('isdir');
          expect(res.body[0]).to.have.property('d_size');
        }
        done();
      })
  })
});