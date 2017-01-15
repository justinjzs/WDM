const app = require('../../../app');
const path = require('path');

const request = require('supertest').agent(app.listen());
const expect = require('chai').expect;


describe('上传文件夹', function () {
  it('登陆成功,重定向', done => {
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

  it('上传文件夹', function (done) {
    request
      .post('/uploaddir')
      .field('path', '/')
      .attach('files', '../files/pic/fox.jpg', `pic?fox.jpg`)
      .attach('files', '../files/pic/tree.jpg', `pic?tree.jpg`)
      .attach('files', '../files/pic/test/cat.jpg', `pic?test?cat.jpg`)
      .expect('Content-Type', /json/)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an('array');
        done();
      })
  })

  it('上传目录错误或不存在', function (done) {
    request
      .post('/uploaddir')
      .field('path', '/999/9999/')
      .attach('files', '../files/pic/fox.jpg', `pic?fox.jpg`)
      .attach('files', '../files/pic/tree.jpg', `pic?tree.jpg`)
      .attach('files', '../files/pic/test/cat.jpg', `pic?test?cat.jpg`)
      .expect('Content-Type', /json/)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.message).to.equal('上传目录错误或不存在!');
        done();
      })
  });
})