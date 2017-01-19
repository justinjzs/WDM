const app = require('../../app');
const path = require('path');
const request = require('supertest').agent(app.listen());
const expect = require('chai').expect;
const query = require('../../controller/db').query();


let pic, doc;
describe('文件(夹)重命名测试', () => {
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

        pic = +res.body[0].key;
        done();
      })
  })
  it('重命名pic文件夹为doc', done => {
    const query = `mutation rename{
      rename(key: ${pic}, name: "doc") {
        key,
        name,
        path,
        isdir,
        ...on folder {
          inside {
            name
          }
        }
      }
    }`;
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
            rename: {
              key: pic,
              name: 'doc',
              path: '/',
              isdir: true,
              inside: [
                {
                  name: 'fox.jpg'
                },
                {
                  name: 'tree.jpg'
                },
                {
                  name: 'test'
                }
              ]
            }
          }
        })
        done();
      })
  })

   it('重命名fox.jpg文件为redfox.jpg', done => {
     let fox = pic + 1;
     const query = `mutation rename{
      rename(key: ${fox}, name: "redfox.jpg") {
        key,
        name,
        path,
        isdir,
        ...on file {
          size
        }
      }
    }`;
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
            rename: {
              key: fox,
              name: 'redfox.jpg',
              path: `/${pic}/`,
              isdir: false,
              size: 105030
            }
          }
        })
        done();
      })
  })

  it('试图重命名key不存在的文件(夹)', done => {
    const query = `mutation rename{
      rename(key: ${pic + 99}, name: "notexist") {
        key,
        name,
        path,
        isdir,
        ...on folder {
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
            rename: null
          },
          errors: [{
            locations: [{
              column: 7,
              line: 2
            }],
            message: 'Key is not existing!',
            path: [
              "rename"
            ]
          }]
        })
        done();
      })
  })

})