const app = require('../../app');
const path = require('path');
const request = require('supertest').agent(app.listen());
const expect = require('chai').expect;
const query = require('../../controller/db').query();

let pic;

describe('移动文件(夹)测试', () => {
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

  it('无法把父文件夹移动到子文件夹内', done => {
    const test = pic + 3;
    const query = `
    mutation move {
      move(key: ${pic}, prePath: "/", newPath: "/${pic}/${test}/") {
        key,
        name,
        path,
        ...on file {
          size
        },
        ... on folder {
          inside {
            name
          }
        }
      }
    }
    `;
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
            move: null
          },
          errors: [
            {
              message: "The destination folder is a subfolder of the source folder",
              locations: [
                {
                  line: 3,
                  column: 7
                }
              ],
              path: [
                "move"
              ]
            }
          ]
        })
        done();
      })
  })

  it('key,prePath 至少有一个错误', done => {
    const fox = pic + 1;
    const query = `
    mutation move {
      move(key: ${pic}, prePath: "/${pic}/", newPath: "/") {
        key,
        name,
        path,
        ...on file {
          size
        },
        ... on folder {
          inside {
            name
          }
        }
      }
    }
    `;
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
            move: null
          },
          errors: [
            {
              locations: [
                {
                  column: 7,
                  line: 3
                }
              ],
              message: 'The key does not match the path',
              path: [
                'move'
              ]
            }
          ]
        })
        done();
      })
  })

  it('移动fox.jpg文件到错误的或不存在的目录下', done => {
    const fox = pic + 1;
    const query = `
    mutation move {
      move(key: ${fox}, prePath: "/${pic}/", newPath: "/0/2/") {
        key,
        name,
        path,
        ...on file {
          size
        },
        ... on folder {
          inside {
            name
          }
        }
      }
    }
    `;
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
            move: null
          },
          errors: [
            {
              locations: [
                {
                  column: 7,
                  line: 3
                }
              ],
              message: 'Path is not existing!',
              path: [
                'move'
              ]
            }
          ]
        })
        done();
      })
  })

  it('移动fox.jpg文件到test文件夹', done => {
    const test = pic + 3;
    const fox = pic + 1;
    const query = `
    mutation move {
      move(key: ${fox}, prePath: "/${pic}/", newPath: "/${pic}/${test}/") {
        key,
        name,
        path,
        ...on file {
          size
        },
        ... on folder {
          inside {
            name
          }
        }
      }
    }
    `;
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
            move: {
              key: fox,
              name: 'fox.jpg',
              path: `/${pic}/${test}/`,
              size: 105030
            }
          }
        })
        done();
      })
  })


  it('移动test文件夹到根目录下', done => {
    const test = pic + 3;
    const fox = pic + 1;
    const query = `
    mutation move {
      move(key: ${test}, prePath: "/${pic}/", newPath: "/") {
        key,
        name,
        path,
        ...on file {
          size
        },
        ... on folder {
          inside {
            name
          }
        }
      }
    }
    `;
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
            move: {
              key: test,
              name: 'test',
              path: `/`,
              inside: [
                {
                  name: 'cat.jpg'
                },
                {
                  name: 'fox.jpg'
                }
              ]
            }
          }
        })
        done();
      })
  })


})