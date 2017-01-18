const app = require('../../app');

const request = require('supertest').agent(app.listen());
const expect = require('chai').expect;

let doc, indoc;

describe('新建文件夹测试', () => {
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

  it('默认在根目录下新建文件夹', done => {
    const query = `
    mutation mkdir {
      mkdir(name: "doc") {
        key,
        name,
        path,
        isdir
      }
    }`
    request
      .post('/graphql')
      .set('Accept', 'application/json')
      .send({ query })
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        doc = res.body.data.mkdir.key;
        expect(res.body).to.deep.equal({
          data: {
            mkdir: {
              key: doc,
              name: 'doc',
              path: '/',
              isdir: true
            }
          }
        })
        done();
      })
  });

  it('在doc目录下新建文件夹', done => {
    const query = `
    mutation mkdir {
      mkdir(name: "indoc", path: "/${doc}/") {
        key,
        name,
        path,
        isdir
      }
    }`
    request
      .post('/graphql')
      .set('Accept', 'application/json')
      .send({ query })
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        indoc = res.body.data.mkdir.key;
        expect(res.body).to.deep.equal({
          data: {
            mkdir: {
              key: indoc,
              name: 'indoc',
              path: '/'+ doc + '/',
              isdir: true
            }
          }
        })
        done();
      })
  });

  it('选择的目录不存在, 返回错误信息', done => {
    const query = `
    mutation mkdir {
      mkdir(name: "indoc", path: "/0/") {
        key,
        name,
        path,
        isdir
      }
    }`
    request
      .post('/graphql')
      .set('Accept', 'application/json')
      .send({ query })
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.deep.equal({
          data: {
            mkdir: null
          },
          errors: [{
            locations: [{
              column: 7,
              line: 3
            }],
            message: 'Path is not existing!',
            path: [
              "mkdir"
            ]
          }]
        })
        done();
      })
  });

})