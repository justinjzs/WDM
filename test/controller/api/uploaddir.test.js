const app = require('../../../app');
const path = require('path');

const request = require('supertest').agent(app.listen());
const expect = require('chai').expect;


describe('上传文件夹', function () {
  it('响应格式为json', function (done) {
    request
      .post('/uploaddir')
      .field('path', '/')
      .attach('files', '../files/pic/fox.jpg', `pic/fox.jpg`)
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

});