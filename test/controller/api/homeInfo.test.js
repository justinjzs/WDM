const app = require('../../../app');

const request = require('supertest').agent(app.listen());
const expect = require('chai').expect;


describe('获取文件信息', function() {
    it('响应格式为json', function(done) {
        request
        .get('/homeinfo')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
    it('响应为对象数组', function(done) {
        request
        .get('/homeinfo')
        .expect(200)
        .end((err, res) => {
            expect(res.body).to.be.an('array');
            expect(res.body[0]).to.be.an('object');
            done();
        })
    });
    it('对象拥有的属性', function(done) {
      request
      .get('/homeinfo')
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
    })
});