const app = require('../../app');
const path = require('path');
const request = require('supertest').agent(app.listen());
const expect = require('chai').expect;
const query = require('../../controller/db').query();

let pic;
describe('删除文件(夹)测试', () => {
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
  });

  it('删除不存在的文件(夹)', done => {
    const query = `
    mutation del{
      delete(key: 0) {
        key,
        name,
        path,
        ...on file {
          size
        },
        ...on folder {
          key
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
            delete: null
          },
          errors: [{
            locations: [{
              column: 7,
              line: 3
            }],
            message: 'Key is not existing!',
            path: [
              "delete"
            ]
          }]
        })
        done();
      })
  })

  it('删除fox.jpg文件', done => {
    let fox = pic + 1;
    const query = `
    mutation del{
      delete(key: ${fox}) {
        key,
        name,
        path,
        ...on file {
          size
        },
        ...on folder {
          key
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
            delete: {
                key: fox,
                name: 'fox.jpg',
                path: `/${pic}/`,
                size: 105030
              }
            
          }
        });

        done()
      })
  })

  it('删除pic文件夹', done => {
    const query = `
    mutation del{
      delete(key: ${pic}) {
        key,
        name,
        path,
        ...on file {
          size
        },
        ...on folder {
         inside {
           key
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
            delete: {
                key: pic,
                name: 'pic',
                path: `/`,
                inside: []
              }
            
          }
        });

        done()
      })
  })

})