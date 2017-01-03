const parse = require('co-body');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const mime = require('mime-types');
const Pool = require('./pool');

module.exports = {
  upload: function *() {
    const { fields, files } = yield handleUpload(this);
    if (!Array.isArray(files.files)) //上传单个文件时，不是数组。<input name='files' />
      files.files = [files.files];

    for (let file of files.files) { //处理每个文件
      const body = {  
        d_hash: file.hash,
        d_dir: path.join(__dirname, `../public/assets/${file.hash}`),
        d_size: file.size,
        u_id: 0,
        path: fields.path,
        name: file.name, //重名处理
        time: new Date()
      }

      fs.rename(file.path, body.d_dir, err => { if (err) throw err; }); //用hash值来重命名

      yield insertDoc(this, body); //插入documents表
      yield insertU_D(this, body); //插入u_d表
    }
  },

  download: function *() {
    const body = this.query;
    const result = yield handleDownload(this, body);
    //发送
    for (let file of result) { //单文件有效
      const { d_dir, name } = file;
      this.set('Content-disposition', 'attachment; filename=' + name);
      this.set('Content-type', mime.lookup(d_dir));
      this.body = fs.createReadStream(d_dir);
    }
  },

  rename: function *() {
    const body = yield parse(this);
    body.lasttime = new Date();
    yield handleRename(this, body);
    
  },

  move: function *() {
    const body = yield parse(this);
    yield handleMove(this, body);
    if (body.isdir) {
      body.prePath += body.key + '/';
      body.newPath += body.key + '/';
      body.u_id = 0;
      yield handleMoveDir(this, body); 
    }
  },

  delete: function *() {
    const body = this.query;
    yield handleDelete(this, body);
  },

  mkdir: function *() {
    const body = yield parse(this);
    body.u_id = 0;
    body.time = new Date();
    yield handleMkdir(this, body);
  }

 }

//上传处理函数和数据库处理函数
const handleUpload = ctx => new Promise((resolve, reject) => { //处理文件上传
    const uploadDir = path.join(__dirname, `../public/assets`);
    let form = formidable.IncomingForm({
      uploadDir,
      keepExtensions: false,
      hash: 'sha1',
      multiples: true
    });

    form.parse(ctx.req, (err, fields, files) => {
      if (err) reject(err);
      resolve({fields, files});
    });
  });

const insertDoc = (ctx, body) => new Promise((resolve, reject) => {
  const { d_hash, d_dir, d_size } = body;
  const values = [d_hash, d_dir, d_size];
  ctx.dbquery("insert into documents (d_hash, d_dir, d_size) values ($1, $2, $3);",
    values,
    (err, result) => {
      if (err) {
        if (err.constraint === "documents_pkey")
          resolve('duplicate');
        reject(err);
      };
      resolve(result);
    });
})

const insertU_D = (ctx, body) => new Promise((resolve, reject) => {
  const { u_id, d_hash, path, name, time } = body;
  const values = [u_id, d_hash, path, name, time, time, false];
  ctx.dbquery(`insert into u_d (u_id, d_hash, path, name, createtime, lasttime, isdir) values ($1, $2, $3, $4, $5, $6, $7);`,
    values,
    (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
})

const handleRename = (ctx, body) => new Promise((resolve, reject) => { //rename 
  const { name, lasttime, key } = body;
  const values = [name, lasttime, key];
  ctx.dbquery(`update u_d set name = $1, lasttime = $2 where key = $3;`,
    values,
    (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
})

const handleMove = (ctx, body) => new Promise((resolve, reject) => { //move 
  const { prePath, newPath, key } = body;
  const values = [prePath, newPath, key];
  ctx.dbquery(`update u_d set path = replace(path, $1, $2) where key = $3;`,
    values,
    (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
})

const handleMoveDir = (ctx, body) => new Promise((resolve, reject) => { //move 
  const { prePath, newPath, u_id } = body;
  const values = [prePath, newPath, u_id];
  ctx.dbquery(`update u_d set path = replace(path, $1, $2) where u_id = $3;`,
    values,
    (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
})



const handleDownload = (ctx, body) => new Promise((resolve, reject) => { //download 
  const { key } = body;
  ctx.dbquery(`select d_dir, name from documents inner join u_d on documents.d_hash = u_d.d_hash where u_d.key in (${key.toString()})`,
    undefined,
    (err, result) => {
      if (err) reject(err);
      resolve(result.rows);
    });
});

const handleDelete = (ctx, body) => new Promise((resolve, reject) => { //download 
  const { key } = body;
  ctx.dbquery(`delete from u_d where key in (${key.toString()})`,
    undefined,
    (err, result) => {
      if (err) reject(err);
      resolve(result.rows);
    });
});

const handleMkdir = (ctx, body) =>new Promise((resolve, reject) => { //download 
  const { u_id, path, name, time } = body;
  const values = [u_id, path, name, time, time, true];
  ctx.dbquery(`insert into u_d (u_id, path, name, createtime, lasttime, isdir) values ($1, $2, $3, $4, $5, $6);`,
    values,
    (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
});