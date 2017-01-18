const app = require('../../app');
const path = require('path');
const request = require('supertest').agent(app.listen());
const expect = require('chai').expect;
const query = require('../../controller/db').query();

let pic, fox, tree, test;

describe('获取文件数据测试', () => {
  //清空数据库
  before(done => query(`delete from u_d;`, 
  undefined,
    () => done())
  )
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

        pic = res.body[0].key;
        done();
      })
  })

  it('默认获取根目录下文件信息(entityByPath)', done => {
    const query = `{
      entityByPath {
        key,
        name,
        path
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
            entityByPath: [
              {
                key: +pic,
                name: 'pic',
                path: '/'
              }
            ]
          }
        });

        done()
      })
  })

    it('获取pic目录下文件信息(entityByPath)', done => {
    const query = `{
      entityByPath(path: "/${pic}/") {
        name,
        path
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
            entityByPath: [
                {
                  name: 'fox.jpg',
                  path: `/${pic}/`
                },
                {
                  name: 'tree.jpg',
                  path: `/${pic}/`
                },
                {
                  name: 'test',
                  path: `/${pic}/`
                }
              ]
          }
        });

        done()
      })
  })

    it('选择的目录不存在，返回错误信息(entityByPath)', done => {
    const query = `{
      entityByPath(path: "/0/") {
        name,
        path
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
            entityByPath: null
          },
          errors: [{
            locations: [{
              column: 7,
              line: 2
            }],
            message: 'Path is not existing!',
            path: [
              "entityByPath"
            ]
          }]
        });

        done()
      })
  })

  it('按key获取pic文件夹信息(entityByKey)', done => {
    const query = `{
      entityByKey(key: ${pic}) {
        key,
        name,
        path,
        ... on file {
          size
        }
        ... on folder {
          inside {
            key,
            name
          }
        }
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

        fox = res.body.data.entityByKey.inside[0].key;
        tree = res.body.data.entityByKey.inside[1].key;
        test = res.body.data.entityByKey.inside[2].key;
        expect(res.body).to.deep.equal({
          data: {
            entityByKey: {
              key: +pic,
              name: 'pic',
              path: '/',
              inside: [
                {
                  key: fox,
                  name: 'fox.jpg'
                },
                {
                  key: tree,
                  name: 'tree.jpg'
                },
                {
                  key: test,
                  name: 'test'
                }
              ]
              }
          }
        });
        done()
      })
  })

  it('按key获取fox.jpg信息(entityByKey)', done => {
    const query = `{
      entityByKey(key: ${fox}) {
        key,
        name,
        path,
        ... on file {
          size
        }
        ... on folder {
          inside {
            name
          }
        }
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
            entityByKey: {
              key: fox,
              size: 105030,
              name: 'fox.jpg',
              path: '/' + pic + '/',
            }
          }
        });

        done()
      })
  })

    it('错误的key获取无法获取到文件信息(entityByKey)', done => {
    const query = `{
      entityByKey(key: 0) {
        key,
        name,
        path,
        ... on file {
          size
        }
        ... on folder {
          inside {
            name
          }
        }
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
            entityByKey: null
          },
          errors: [{
            locations: [{
              column: 7,
              line: 2
            }],
            message: 'Key is not existing!',
            path: [
              "entityByKey"
            ]
          }]
        });

        done()
      })
  })

  it('默认搜索根目录下的tree (entityByName)', done => {
    const query = `{
      entityByName(name: "tree") {
        key,
        name,
        path,
        ... on file {
          size
        }
        ... on folder {
          inside {
            name
          }
        }
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
            entityByName: [
              {
                key: tree,
                size: 140106,
                name: 'tree.jpg',
                path: '/' + pic + '/',
              }
            ]
          }
        });

        done()
      })
  });

  it('找不到test目录下的tree (entityByName)', done => {
    const query = `{
      entityByName(name: "tree", path: "/${pic}/${test}/") {
        key,
        name,
        path,
        ... on file {
          size
        }
        ... on folder {
          inside {
            name
          }
        }
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
            entityByName: []
          }
        });

        done()
      })
  });

  it('选择的目录不存在 (entityByName)', done => {
    const query = `{
      entityByName(name: "tree", path: "/0/1/") {
        key,
        name,
        path,
        ... on file {
          size
        }
        ... on folder {
          inside {
            name
          }
        }
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
            entityByName: null
          },
          errors: [{
            locations: [{
              column: 7,
              line: 2
            }],
            message: 'Path is not existing!',
            path: [
              "entityByName"
            ]
          }]

        });

        done()
      })
  });
})