const parse = require('co-body');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const cofs = require('co-fs')
const mime = require('mime-types');
const randomstring = require('randomstring');
const archiver = require('archiver');
const Pool = require('./pool');
require('events').EventEmitter.prototype._maxListeners = 100; //设置最大为100，或置0取消


module.exports = {
  upload: function *() {
    const { fields, files } = yield handleUpload(this);


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
    const query = this.query;
    //文件信息
    const files = yield searchFiles(this, query);
    //移除前缀
    rmProfix(files);
    //改写路径
    rewritePath(files);
    //临时目录
    const tmp = fs.mkdtempSync(path.join(__dirname, '../public/download/'));
    //复制文件
    copyFiles(files, tmp);
    //压缩文件
    const zipInfo = yield zip(tmp);
    //发送文件
    sendZip(this, zipInfo);
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
    const query = this.query;
    yield handleDelete(this, query);
  },

  mkdir: function *() {
    const body = yield parse(this);
    body.u_id = 0;
    body.time = new Date();
    const result = yield handleMkdir(this, body);
    console.log(result);
  },

  share: function *() {
    //拿到key
    const body = yield parse(this); 
    //拿到记录
    let rows = yield searchFiles(this, body); 
    //移除前缀
    rmProfix(rows); 
    //构insertShare所需的信息
    const result = {
      u_id: 0,
      addr: randomstring.generate(10),
      secret: (!!+body.isSecret) ? randomstring.generate(6) : null,
      rows
    }
    //添加share表
    const { addr, secret } = yield insertShare(this, result); 
    //响应信息
    const res = {
      addr,
      secret
    }
    //响应
    sendJSON(this, res);
  },

  unshare: function *() {
    const body = yield parse(this);
    body.u_id = 0;
    const res = yield handleUnshare(this, body);

    this.set('Content-type', 'application/json');
    this.body = JSON.stringify(res);
  },

  downShare: function *() {
    //获取query
    const query = this.query;
    //查询文件信息
    const files = yield handleDownshare(this, query);
    //创建临时目录
    const tmp = fs.mkdtempSync(path.join(__dirname, '../public/download/'));
    //改写文件目录
    rewritePath(files);
    //复制文件到临时目录
    copyFiles(files, tmp);
    //压缩
    const zipInfo = yield zip(tmp);
    //发送zip
    sendZip(this, zipInfo);

  }

 }


//发送压缩包
const sendZip = ( ctx, zipInfo ) => {
  const {zipPath, zipName} = zipInfo;
  ctx.set('Content-disposition', 'attachment; filename=' + zipName);
  ctx.set('Content-type', mime.lookup(zipPath));
  ctx.body = fs.createReadStream(zipPath);
  ctx.body.on('close', () => fs.unlinkSync(zipPath));

}
//发送json格式的响应
const sendJSON = (ctx, json) => {
  ctx.set('Content-type', 'application/json');
  ctx.body = JSON.stringify(json);
}


//压缩制定目录下的文件夹
const zip = tmp => new Promise((resolve, reject) => {
  if (!fs.existsSync(tmp))
    reject('tmp is not exist!');
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
      if (!Array.isArray(files.files)) //上传单个文件时，不是数组。<input name='files' />
        files.files = [files.files];
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
  const values = '(' + key.join(',') + ')';
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

const insertShare = (ctx, body) =>new Promise((resolve, reject) => { //insertshare 
  let { u_id, addr, secret, rows } = body;
  secret = secret && `'${secret}'`;
  let values = rows.map(row => (
    `('${addr}', ${secret}, ${u_id}, ${row.key}, '${row.d_hash}', '${row.d_dir}', ${row.isdir}, '${row.path}', '${row.name}')`
  ));
  values = values.join(',');
  ctx.dbquery(`insert into share (addr, secret, u_id, key, d_hash, d_dir, isdir, path, name) values ${values} returning addr, secret;`,
    undefined,
    (err, result) => {
      if (err) reject(err);
      resolve(result.rows[0]);
    });
});

const handleUnshare = (ctx, body) => new Promise((resolve, reject) => { //download 
  const { addr, u_id } = body;
  const values = [addr, u_id];
  ctx.dbquery(`delete from share where addr = $1 and u_id = $2 ;`,
    values,
    (err, result) => {
      if (err) reject(err);
      resolve({done: true});
    });
});

//按文件层次排序，并移除公共前缀
//files:Array of { path }
const rmProfix = files => {  
  files.sort((a, b) => a.path.match(/\//g).length > b.path.match(/\//g).length ); //排序
  const profix = files[0].path; //前缀
  for (let file of files) 
    file.path = file.path.replace(profix, '/');
};

//改写路径 /key/ --> /name/
//files: Array of { key, name, path }
const rewritePath = files => {
  const dirMap = {};
  for (let file of files) 
    dirMap[file.key] = file.name;
  for (let file of files) {
    let temp = file.path.split('/');
    temp = temp.map(key => key && dirMap[+key] );
    file.path = temp.join('/') + file.name;
  } 
}

//复制文件到指定目录下
//files:Array of { path, isdir, d_dir }
const copyFiles = (files, dir) => { 
  for (let file of files) { 
  //移动
  const dist = dir + file.path ; //目标路径
  if (file.isdir)
    fs.mkdirSync(dist);
  else
    fs.createReadStream(file.d_dir).pipe(fs.createWriteStream(dist));
  }  
}

const handleDownshare = (ctx, body) =>new Promise((resolve, reject) => { //downloadzip 
  const { addr } = body;
  const values = [addr];
  ctx.dbquery(`select key, name, path, isdir, d_dir from share where addr = $1 ;`,
    values,
    (err, result) => {
      if (err) reject(err);
      resolve(result.rows);
    });
});