const app = require('../../../app');

const request = require('supertest').agent(app.listen());
const expect = require('chai').expect;


describe('移动文件(夹)', done => {
  it('移动文件', () => {
    request
    .post('/move?_method=PUT')
    .send({
      key: 147,
      prePath: '/',
      newPath: '/148/',
      isdir: false
    })
    .expect(200)
    .end((err, res) => {
      expect(res.body).to.be.an('array');
      expect(res.body[0].key).to.equal('147');
      expect(res.body[0].path).to.be.equal('/148/');
      done();
    })
  });

    it('移动文件', () => {
    request
    .post('/move?_method=PUT')
    .send({
      key: 151,
      prePath: '/148/',
      newPath: '/',
      isdir: true
    })
    .expect(200)
    .end((err, res) => {
      if(err) throw err;
      expect(res.body).to.be.an('array');
      expect(res.body[0].key).to.equal('147');
      expect(res.body[0].path).to.be.equal('/148/');
      done();
    })
  });
})