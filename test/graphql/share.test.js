const app = require('../../app');
const path = require('path');
const request = require('supertest').agent(app.listen());
const expect = require('chai').expect;
const query = require('../../controller/db').query();

let pic, shareAddr, shareSecret;
describe('获取分享页信息', () => {
  before(done => query(`delete from u_d;`, 
  undefined,
    () => done())
  );

  before(done => query(`delete from share;`, 
  undefined,
    () => done())
  );

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
        done();
      })
  });

  it('上传文件夹', done => {
    request
      .post('/uploaddir')
      .field('path', '/')
      .attach('files', path.join(__dirname, '../api/files/pic/fox.jpg'), `pic?fox.jpg`)
      .attach('files', path.join(__dirname, '../api/files/pic/tree.jpg'), `pic?tree.jpg`)
      .attach('files', path.join(__dirname, '../api/files/pic/test/cat.jpg'), `pic?test?cat.jpg`)
      .expect('Content-Type', /json/)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an('array');

        pic = +res.body[0].key;
        done();
      })
  });

    it('公开链接', done => {
    const req = {
      keys: [pic],
      isSecret: false
    }
    request
      .post('/addshare')
      .send(req)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.body).to.be.an('object');
        expect(res.body.addr).to.be.a('string');
        expect(res.body.secret).to.equal(null);

        shareAddr = res.body.addr;
        console.log(shareAddr);
        done();
      })
  });

   it('获取密码', done => {
     const query = `{
      secret(addr: "${shareAddr}")
    }`;
    request
      .post('/graphqlshare')
      .set('Accept', 'application/json')
      .send({ query })
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.deep.equal({
          data: {
            secret: null
          }
        })
        done();
      })
  })

   it('根据路径获取文件信息(entityByPath)', done => {
     const query = `{
        entityByPath(addr: "${shareAddr}"){
        isdir,
        name
      }
    }`;
    request
      .post('/graphqlshare')
      .set('Accept', 'application/json')
      .send({ query })
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.deep.equal({
          data: {
            entityByPath: [{
              name: 'pic',
              isdir: true
            }]
          }
        })
        done();
      })
  })

})