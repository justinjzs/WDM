const app = require('../../app');

const request = require('supertest').agent(app.listen());
const expect = require('chai').expect;

let Cookies;
let root = [];
let renameFile, renameDir;
let delFile, delDir;
let moveFile, moveDir, distDir;
let downFile, downDir;

describe('登录前请求受限的API', () => {
  it('GET /homeinfo', done => {
    request
      .get('/homeinfo')
      .expect('Location', '/login')
      .expect('Content-Type', /html/)
      .expect(302, done)
  })
})

describe('登录', () => {
  it('未登录，请求/home失败', done => {
    request
      .get('/home')
      .expect('Location', '/login')
      .expect('Content-Type', /html/)
      .expect(302, done)
  })

  it('登陆成功,重定向', done => {
    request
      .post('/login')
      .type('form')
      .send({username: 'test', password: 'test'})
      .expect('Location', '/home')
      .expect('Content-Type', /html/)
      .expect(302)
      .end((err, res) => {
        if(err) return done(err);
        Cookies = res.headers['set-cookie'].map( cookie => 
          cookie.split(';').shift() 
        ).join('; ');
        done();
      })
  });
  
  it('已登录，请求/home成功', done => {
    request
      .get('/home')
      .expect('Content-Type', /html/)
      .expect(200, done)
  })
})
//test 无文件
describe('GET /homeinfo', () => {
  it('响应格式为json', done => {
    request
      .get('/homeinfo')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
  it('无文件，返回空数组', done => {
    request
      .get('/homeinfo')
      .expect(200)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.equal(0);
        done();
      })
  });
})
//上传文件
describe('POST /upload', () => {

  it('上传cat.jpg,tree.jpg到根目录', done => {
    request
      .post('/upload')
      .field('path', '/')
      .attach('files', './files/cat.jpg')
      .attach('files', './files/tree.jpg')
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.body).to.be.an('array');

        expect(res.body[0]).to.be.an('object');
        expect(res.body).to.have.length(2);

        expect(res.body[0]).to.have.property('key');
        expect(res.body[0]).to.have.property('name');
        expect(res.body[0]).to.have.property('path');
        expect(res.body[0]).to.have.property('createtime');
        expect(res.body[0]).to.have.property('lasttime');
        expect(res.body[0]).to.have.property('isdir');
        expect(res.body[0]).to.have.property('d_size');

        renameFile = res.body[0];
        moveFile = res.body[1];
        done();
      })
  });

  it('无上传文件', done => {
    request
      .post('/upload')
      .field('path', '/')
      .expect(200)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('至少上传一个文件!');
        done();
      })
  });

  it('上传目录错误或不存在', done => {
    request
      .post('/upload')
      .field('path', '/123/321/')
      .attach('files', './files/cat.jpg')
      .expect(200)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('上传目录错误或不存在!');
        done();
      })
  });
});
//新建文件夹
describe('POST /mkdir', () => {
  it('新建文件夹', done => {
    request
      .post('/mkdir')
      .send({path: '/', name: 'doc'})
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('key');
        expect(res.body).to.have.property('name');
        expect(res.body).to.have.property('path');
        expect(res.body).to.have.property('createtime');
        expect(res.body).to.have.property('lasttime');
        expect(res.body).to.have.property('isdir');

        moveDir = res.body;
        distDir = res.body;
        done();
      })
  });
  it('目录错误或不存在', done => {
    request
      .post('/mkdir')
      .send({path: '/123/321', name: 'doc'})
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('目录错误或不存在!');
        done();
      })
  });
})
//重命名cat.jpg
describe('PUT /rename', () => {
  it('重命名', done => {

    request
      .post('/rename?_method=PUT')
      .send({ name: 'pic.jpg', key: renameFile.key })
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.body).to.be.an('object');
        expect(res.body.key).to.equal(renameFile.key);
        expect(res.body.name).to.equal('pic.jpg');

        delFile = res.body;
        done();
      })
  });

  it('key错误或不存在', done => {
    request
      .post('/rename?_method=PUT')
      .send({ name: 'pic.jpg', key: -1 })
      .expect(200)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.equal('非法操作！');
        done();
      })
  });
})
//移动文件
describe('PUT /move', () => {
  it('移动文件', done => {
    const req = {
      key: moveFile.key,
      prePath: moveFile.path,
      newPath: distDir.path + distDir.key + '/',
      isdir: false
    }
    request
      .post('/move?_method=PUT')
      .send(req)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.equal(1);
        expect(res.body[0].key).to.equal(req.key);
        expect(res.body[0].path).to.be.equal(req.newPath);
        done();
      })
  });

    it('新建文件夹', done => {
    request
      .post('/mkdir')
      .send({path: '/', name: 'del'})
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('key');
        expect(res.body).to.have.property('name');
        expect(res.body).to.have.property('path');
        expect(res.body).to.have.property('createtime');
        expect(res.body).to.have.property('lasttime');
        expect(res.body).to.have.property('isdir');

        distDir = res.body;
        delDir = res.body;
        done();
      })
  });

  it('移动文件夹', done => {
    const req = {
      key: moveDir.key,
      prePath: moveDir.path,
      newPath: distDir.path + distDir.key + '/',
      isdir: true
    }
    request
      .post('/move?_method=PUT')
      .send(req)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.equal(2);
        expect(res.body[0].key).to.equal(req.key);
        expect(res.body[0].path).to.be.equal(req.newPath);
        expect(res.body[1].key).to.be.equal(moveFile.key)
        expect(res.body[1].path).to.be.equal(req.newPath + moveDir.key + '/');

        done();
      })
  });
})
//下载 
describe('GET /download', () => {
  it('下载单个文件', done => {
    downFile = moveFile;
    request
      .get(`/download?key=${downFile.key}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        console.log(res.header);
        done();
      })

  });
})

// //删除
describe('DELETE /delete', () => {
  it('删除文件', done => {
    request
      .post('/delete?_method=DELETE')
      .send({ key: delFile.key })
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an('object');
        expect(res.body.done).to.equal(true);
        done()
      })
  });
  it('删除文件夹', done => {
    request
      .post('/delete?_method=DELETE')
      .send({key: delDir.key})
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.body).to.be.an('object');
        expect(res.body.done).to.equal(true);
        done()
      })
  })
})

