const app = require('../../../app');

const request = require('supertest').agent(app.listen());
const expect = require('chai').expect;


describe('重命名', () => {

    it('响应体拥有的属性', done => {
        request
        .post('/rename?_method=PUT')
        .send({name: 'pic.jpg', key: 147 })
        .expect(200)
        .end((err, res) => {
            expect(res.body).to.be.an('object');
            expect(res.body.key).to.equal('147');
            expect(res.body.name).to.equal('pic.jpg');
            done();
        })
    });

    it('key错误或不存在', done => {
      request
        .post('/rename?_method=PUT')
        .send({ name: 'pic.jpg', key: -1 })
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('非法操作！');
          done();
        })
    });
})