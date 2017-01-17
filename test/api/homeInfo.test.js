const app = require('../../app');

const request = require('supertest').agent(app.listen());
const expect = require('chai').expect;

let entry;

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

          entry = res.body[0];
        }
        done();
      })
  })
  
  it('获取指定文件(夹)的信息', function (done) {
    if(!entry) { //无文件就不执行
      return done();
    }
    request
      .get(`/homeinfo?key=${entry.key}`)
      .expect(200)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('key');
        expect(res.body).to.have.property('name');
        expect(res.body).to.have.property('path');
        expect(res.body).to.have.property('createtime');
        expect(res.body).to.have.property('lasttime');
        expect(res.body).to.have.property('isdir');
        expect(res.body).to.have.property('d_size');
        done();
      })
  })
});