const app = require('../../../app');

const request = require('supertest').agent(app.listen());
const expect = require('chai').expect;


describe('上传文件', function () {
  it('响应类型为json', function (done) {
    request
      .post('/upload')
      .field('path', '/')
      .attach('files', '../files/cat.jpg')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('响应体为对象数组', function (done) {
    request
      .post('/upload')
      .field('path', '/')
      .attach('files', '../files/cat.jpg')
      .attach('files', '../files/tree.jpg')
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.be.an('array');
        expect(res.body[0]).to.be.an('object');
        expect(res.body).to.have.length(2);
        done();
      })
  });

  it('对象拥有的属性', function (done) {
    request
      .post('/upload')
      .field('path', '/')
      .attach('files', '../files/cat.jpg')
      .expect(200)
      .end((err, res) => {
        expect(res.body[0]).to.have.property('key');
        expect(res.body[0]).to.have.property('name');
        expect(res.body[0]).to.have.property('path');
        expect(res.body[0]).to.have.property('createtime');
        expect(res.body[0]).to.have.property('lasttime');
        expect(res.body[0]).to.have.property('isdir');
        expect(res.body[0]).to.have.property('d_size');
        done();
      })
  });

    it('无上传文件', function (done) {
    request
      .post('/upload')
      .field('path', '/')
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('至少上传一个文件!');
        done();
      })
  });

  it('路径错误或不存在', function (done) {
    request
      .post('/upload')
      .field('path', '/123/321/')
      .attach('files', '../files/cat.jpg')
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('上传目录错误或不存在!');
        done();
      })
  });

});