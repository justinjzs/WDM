const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const mime = require('mime-types');
const randomstring = require('randomstring');
const archiver = require('archiver');

module.exports = function handle() {
  //发送压缩包1
  const sendFile = (ctx, fileInfo) => {
    const {filePath, fileName} = fileInfo;
    ctx.set('Content-disposition', 'attachment; filename=' + fileName);
    ctx.set('Content-type', mime.lookup(filePath));
    ctx.body = fs.createReadStream(filePath);
    ctx.body.on('close', () => fs.unlinkSync(filePath));

  }
  //发送json格式的响应2
  const sendJSON = (ctx, json) => {
    ctx.set('Content-type', 'application/json');
    ctx.body = JSON.stringify(json);
  }


  //压缩制定目录下的文件夹3
  const zip = tmp => new Promise((resolve, reject) => {
    if (!fs.existsSync(tmp))
      reject('tmp is not exist!');

    const fileName = new Date().getTime().toString() + '.zip';
    const filePath = tmp + fileName;
    const archive = archiver('zip', {
      store: true
    });
    const output = fs.createWriteStream(filePath);

    archive.on('error', err => reject(err));

    archive.pipe(output);

    archive.directory(tmp, '/');
    archive.finalize();
    output.on('close', () => { delDir(tmp); resolve({ filePath, fileName }); });
  });
  //删除目录及其内容4
  const delDir = dir => { 
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

  //上传处理函数5
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
      resolve({ fields, files });
    });
  });
  //插入documents表6
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
  //插入u_d表7
  const insertU_D = (ctx, body) => new Promise((resolve, reject) => {
    const { u_id, d_hash, path, name, time } = body;
    const values = [u_id, d_hash, path, name, time, time, false];
    ctx.dbquery(`insert into u_d (u_id, d_hash, path, name, createtime, lasttime, isdir) values ($1, $2, $3, $4, $5, $6, $7) returning key, path, name, lasttime, isdir;`,
      values,
      (err, result) => {
        if (err) reject(err);
        resolve(result.rows);
      });
  })
  //重命名8
  const handleRename = (ctx, body) => new Promise((resolve, reject) => { //rename 
    const { name, lasttime, key } = body;
    const values = [name, lasttime, key];
    ctx.dbquery(`update u_d set name = $1, lasttime = $2 where key = $3 returning key, name;`,
      values,
      (err, result) => {
        if (err) reject(err);
        resolve(result.rows[0]);
      });
  })
  //移动9
  const handleMove = (ctx, body) => new Promise((resolve, reject) => { //move 
    const { prePath, newPath, key } = body;
    const values = [prePath, newPath, key];
    ctx.dbquery(`update u_d set path = replace(path, $1, $2) where key = $3 returning key, name, path;`,
      values,
      (err, result) => {
        if (err) reject(err);
        resolve(result.rows);
      });
  })
  //移动文件夹10
  const handleMoveDir = (ctx, body) => new Promise((resolve, reject) => { //move 
    const { prePath, newPath, u_id } = body;
    const values = [prePath, newPath, u_id];
    ctx.dbquery(`update u_d set path = replace(path, $1, $2) where u_id = $3 returning key, name, path, isdir;`,
      values,
      (err, result) => {
        if (err) reject(err);
        resolve(result.rows);
      });
  })


  //下载11
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
  //删除12
  const handleDelete = (ctx, body) => new Promise((resolve, reject) => { //download 
    const { key } = body;
    ctx.dbquery(`delete from u_d where key in (${key.toString()})`,
      undefined,
      (err, result) => {
        if (err) reject(err);
        resolve({done: true});
      });
  });
  //新建文件夹13
  const handleMkdir = (ctx, body) => new Promise((resolve, reject) => { //download 
    const { u_id, path, name, time } = body;
    const values = [u_id, path, name, time, time, true];
    ctx.dbquery(`insert into u_d (u_id, path, name, createtime, lasttime, isdir) values ($1, $2, $3, $4, $5, $6) returning key, name, path, isdir,createtime, lasttime;`,
      values,
      (err, result) => {
        if (err) reject(err);
        resolve(result.rows[0]);
      });
  });
  //查询文件14
  const searchFiles = (ctx, body) => new Promise((resolve, reject) => { //downloadzip 
    const { key } = body;
    const values = '(' + key.join(',') + ')';
    ctx.dbquery(`select key, u_d.d_hash, d_dir, isdir, path, name from u_d left join documents on documents.d_hash = u_d.d_hash where u_d.key in ${values}  ;`,
      undefined,
      (err, result) => {
        if (err) reject(err);
        resolve(result.rows);
      });
  });

  //上传文件夹15
  function* handleUploadDir(ctx, level) {
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
  //分享16
  const handleShare = (ctx, body) => new Promise((resolve, reject) => {  
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
  //取消分享17
  const handleUnshare = (ctx, body) => new Promise((resolve, reject) => { //download 
    const { addr, u_id } = body;
    const values = [addr, u_id];
    ctx.dbquery(`delete from share where addr = $1 and u_id = $2 ;`,
      values,
      (err, result) => {
        if (err) reject(err);
        resolve({ done: true });
      });
  });

  //按文件层次排序，并移除公共前缀18
  //files:Array of { path }
  const rmProfix = files => {
    files.sort((a, b) => a.path.match(/\//g).length > b.path.match(/\//g).length); //排序
    const profix = files[0].path; //前缀
    for (let file of files)
      file.path = file.path.replace(profix, '/');
  };

  //改写路径 /key/ --> /name/  19
  //files: Array of { key, name, path }
  const rewritePath = files => {
    const dirMap = {};
    for (let file of files)
      dirMap[file.key] = file.name;
    for (let file of files) {
      let temp = file.path.split('/');
      temp = temp.map(key => key && dirMap[+key]);
      file.path = temp.join('/') + file.name;
    }
  }

  //复制文件到指定目录下20
  //files:Array of { path, isdir, d_dir }
  const copyFiles = (files, dir) => {
    for (let file of files) {
      //移动
      const dist = dir + file.path; //目标路径
      if (file.isdir)
        fs.mkdirSync(dist);
      else
        fs.createReadStream(file.d_dir).pipe(fs.createWriteStream(dist));
    }
  }
  //下载分享内容21
  const handleDownshare = (ctx, body) => new Promise((resolve, reject) => { //downloadzip 
    const { addr } = body;
    const values = [addr];
    ctx.dbquery(`select key, name, path, isdir, d_dir from share where addr = $1 ;`,
      values,
      (err, result) => {
        if (err) reject(err);
        resolve(result.rows);
      });
  });


  //生成文件树22
  function dirTree(fields, files, u_id = 0) {
    const root = {
      path: fields.path,
      name: '',
      children: []
    };

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
            path: (preDir => () => (preDir.path + (preDir.key ? preDir.key + '/' : '')))(preDir), //闭包。记下当前的preDir对象。
            key: 'key',
            children: []
          };
          preDir.children = [...preDir.children, curDir];
        }
        preDir = curDir;
      }

      body.path = (preDir => () => (preDir.path + preDir.key + '/'))(preDir);  //补全文件path
      preDir.children = [...preDir.children, body]
    }

    return root.children;
  }
  //获取主页信息23
  const handleHomeInfo = (ctx, body) => new Promise((resolve, reject) => {
    const { u_id } = body;
    const values = [u_id];
    ctx.dbquery(`select key, name, path, isdir, lasttime, d_size from u_d left join documents on u_d.d_hash = documents.d_hash where u_id = $1 ;`,
      values,
      (err, result) => {
        if (err) reject(err);
        resolve(result.rows);
      });
  });
  //获取分享页信息24
  const handleShareInfo = (ctx, body) => new Promise((resolve, reject) => {
    const { addr } = body;
    const values = [addr];
    ctx.dbquery(`select key, name, path, isdir, d_hash from share where addr = $1 ;`,
      values,
      (err, result) => {
        if (err) reject(err);
        resolve(result.rows);
      });
  });

  const handleSaveShare = (ctx, body) => new Promise((resolve, reject) => {
    const { u_id, time, rows } = body;
    let values = rows.map( row => (
      `('${row.name}', '${row.path}', ${row.isdir}, '${row.d_hash}', ${u_id}, ${time}, ${time})`
    ) );
    values = values.join(',');
    ctx.dbquery(`insert into u_d (name, path, isdir, d_hash, u_id, createtime, lasttime) values ${values} returning key ;`,
      values,
      (err, result) => {
        if (err) reject(err);
        resolve({done: true});
      });
  });

return {
  handleSaveShare,
  handleHomeInfo,
  handleShareInfo,
  handleUpload,
  handleUploadDir,
  handleDelete,
  handleDownload,
  handleDownshare,
  handleUnshare,
  handleMkdir,
  searchFiles,
  handleMove,
  handleMoveDir,
  handleRename,
  insertDoc,
  insertU_D,
  handleShare,
  sendFile,
  sendJSON,
  zip,
  delDir,
  dirTree,
  rmProfix,
  rewritePath,
  copyFiles 
}




}