const parse = require('co-body');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const cofs = require('co-fs')
const mime = require('mime-types');
const archiver = require('archiver');
const Pool = require('./pool');
require('events').EventEmitter.prototype._maxListeners = 100; //设置最大为100，或0，取消



module.exports = {
  upload: function *() {
    const { fields, files } = yield handleUpload(this);
    if (!Array.isArray(files.files)) //上传单个文件时，不是数组。<input name='files' />
      files.files = [files.files];

    const time = new Date();    //统一上传时间。
    for (let file of files.files) { //处理每个文件
      const body = {  
        d_hash: file.hash,
        d_dir: path.join(__dirname, `../public/assets/${file.hash}`),
        d_size: file.size,
        u_id: 0,
        path: fields.path,
        name: file.name,
        time
      }

      fs.rename(file.path, body.d_dir, err => { if (err) throw err; }); //用hash值来重命名

      yield insertDoc(this, body); //插入documents表
      yield insertU_D(this, body); //插入u_d表
    }
  },

  uploadDir: function *() {
    const { fields, files } = yield handleUpload(this);  //解析请求
    if (!Array.isArray(files.files)) //上传单个文件时，不是数组。<input name='files' />
      files.files = [files.files];

    const root = {
      path: fields.path,
      name: '',
      children: []
    }; 
    const u_id = 0;
    const time = new Date();    //统一上传时间

    //产生dirtree
    for (let file of files.files) {
      let dirPath = file.name.split('/');
      //记录文件信息
      const body = {  //insertDoc(): 必需d_hash, d_dir, d_size, 
        d_hash: file.hash,
        d_dir: path.join(__dirname, `../public/assets/${file.hash}`),
        d_size: file.size,
        u_id,         //insertU_D(): 必需u_id, d_hash, name, time, path (缺path)
        name: dirPath.pop(),
        time
      }

      fs.rename(file.path, body.d_dir, err => { if (err) throw err; }); //用hash值来重命名

      let preDir = root;
      for (let name of dirPath) {
        let flag = true;   //目录记录标志
        let curDir;       //当前目录
        for (let dup of preDir.children) { //遍历，判断是否已记录该目录
          if (dup.name === name) {
            flag = false;
            curDir = dup;  //获取当前目录
            break;
          }
        }
        if (flag) { //未记录目录
          //记录目录信息
          curDir = { //handleMkdir(): u_id, name, time, path
            u_id,
            name,
            time,
            path: ( preDir => () => (preDir.path + (preDir.key ? preDir.key + '/' : '')))(preDir), //闭包。记下当前的preDir对象。
            key: 'key',
            children: []
          };
          preDir.children = [...preDir.children, curDir];
        }
        preDir = curDir;
      }

      body.path = ( preDir => () => (preDir.path + preDir.key + '/'))(preDir);  //补全文件path
      preDir.children = [...preDir.children, body]
    }

    yield handleUploadDir(this, root.children);
  },

  download: function *() {
    const body = this.query;
    const { d_dir, name } = yield handleDownload(this, body);
    //发送
    this.set('Content-disposition', 'attachment; filename=' + name);
    this.set('Content-type', mime.lookup(d_dir));
    this.body = fs.createReadStream(d_dir);

  },

  downloadzip: function *() {


    const body = this.query;
    const result = yield searchFiles(this, body);

    result.sort((a, b) => a.path.match(/\//g).length > b.path.match(/\//g).length ); //排序
    let profix = result[0].path; //前缀

    const dirMap = {};  //key--name 映射
    for (let file of result) 
      dirMap[file.key] = file.name;

       //临时目录
      const tmp = fs.mkdtempSync(path.join(__dirname, '../public/download/')); 
      

    for (let file of result) { 
      // 重写路径
      file.path = file.path.replace(profix, '/');
      let temp = file.path.split('/');
      temp = temp.map(key => key && dirMap[+key] );
      file.path = temp.join('/') + file.name;

      //移动
      const dist = tmp + file.path ; //目标路径
      if (file.isdir)
        fs.mkdirSync(dist);
      else
        fs.createReadStream(file.d_dir).pipe(fs.createWriteStream(dist));
    }

    //压缩
    const {zipPath, zipName} = yield zip(tmp);
    this.set('Content-disposition', 'attachment; filename=' + zipName);
    this.set('Content-type', mime.lookup(zipPath));
    this.body = fs.createReadStream(zipPath);
    this.body.on('close', () => fs.unlinkSync(zipPath));

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
    const result = yield handleMkdir(this, body);
    console.log(result);
  }

 }




//压缩
const zip = tmp => new Promise((resolve, reject) => {
  const zipName = new Date().getTime().toString() + '.zip';
  const zipPath = tmp + zipName;
  const archive = archiver('zip', {
    store: true
  });
  const output = fs.createWriteStream(zipPath);
  archive.on('error', err => reject(err));
  archive.pipe(output);
  let dest =  tmp.split(path.sep).pop();

  archive.directory(tmp, '/');
  archive.finalize();
  output.on('close', () => {delDir(tmp); resolve({zipPath, zipName}); });
});

const delDir = dir => { //删除目录
  if (fs.existsSync(dir)) {
    let files = fs.readdirSync(dir);
    //移除目录内容
    for (let file of files) {
      curDir = dir + '/' + file;
      if (fs.statSync(curDir).isDirectory())
        delDir(curDir);
      else
        fs.unlinkSync(curDir);
    }
    //移除目录
    fs.rmdirSync(dir);
  }
};



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
  const values = [key];
  ctx.dbquery(`select d_dir, name from documents inner join u_d on documents.d_hash = u_d.d_hash where u_d.key = $1;`,
    values,
    (err, result) => {
      if (err) reject(err);
      resolve(result.rows[0]);
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
  ctx.dbquery(`insert into u_d (u_id, path, name, createtime, lasttime, isdir) values ($1, $2, $3, $4, $5, $6) returning key;`,
    values,
    (err, result) => {
      if (err) reject(err);
      resolve(result.rows[0].key);
    });
});

const searchFiles = (ctx, body) =>new Promise((resolve, reject) => { //downloadzip 
  const { key } = body;
  values = '(' + key.join(',') + ')';
  ctx.dbquery(`select key, u_d.d_hash, d_dir, isdir, path, name from u_d left join documents on documents.d_hash = u_d.d_hash where u_d.key in ${values}  ;`,
    undefined,
    (err, result) => {
      if (err) reject(err);
      resolve(result.rows);
    });
});


function *handleUploadDir(ctx, level) {
  while (level.length) { //为空即全部完成。
    let nextLevel = []; //下一层

    for (let body of level) {
      body.path = body.path(); //获取path
      //更新数据库
      if (body.children) {   //是目录
        body.key = yield handleMkdir(ctx, body);
        nextLevel = [...nextLevel, ...body.children]; //下一层的文件/目录
      } else {  //不是目录
        yield insertDoc(ctx, body);
        body.key = yield insertU_D(ctx, body);
      }    
    }

    level = nextLevel; //更新level
  }

}

