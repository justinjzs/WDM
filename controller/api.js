const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const mime = require('mime-types');
const randomstring = require('randomstring');
const { 
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
} = require('./handle.js')();



require('events').EventEmitter.prototype._maxListeners = 100; //设置最大为100，或置0取消


module.exports = {
  //主页
  homeInfo: function *() {
    const query = {u_id: 0};
    const rows = yield handleHomeInfo(this, query);
    sendJSON(this, rows);
  },
  //分享页
  shareInfo: function *() {
    const query = this.query;
    const rows = yield handleShareInfo(this, query);
    sendJSON(this, rows);
  },
  //上传文件
  upload: function *() {
    const { fields, files } = yield handleUpload(this);

    let rows = []; //响应体
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
      const row = yield insertU_D(this, body); //插入u_d表
      rows = [...rows, ...row];
    }
    //响应
    sendJSON(this, rows);
  },
  //上传文件夹
  uploadDir: function *() {
    const { fields, files } = yield handleUpload(this);  //解析请求
    //生成文件树
    const body = dirTree(fields, files)
    //处理文件夹
    yield handleUploadDir(this, body);

    sendJSON(this, body);
  },
  //下载单文件
  download: function *() {
    const body = this.query;
    const { d_dir, name } = yield handleDownload(this, body);
    //发送
    this.set('Content-disposition', 'attachment; filename=' + name);
    this.set('Content-type', mime.lookup(d_dir));
    this.body = fs.createReadStream(d_dir);

  },
  //多文件下载
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
    const fileInfo = yield zip(tmp);
    //发送文件
    sendFile(this, fileInfo);
  },
  //重命名
  rename: function *() {
    const body = this.request.body;
    body.lasttime = new Date();
    const res = yield handleRename(this, body);
    sendJSON(this, res);
    
  },
  //移动
  move: function *() {
    const body = this.request.body;
    let res = yield handleMove(this, body);
    if (body.isdir) {
      body.prePath += body.key + '/';
      body.newPath += body.key + '/';
      body.u_id = 0;
      let res_dir = yield handleMoveDir(this, body);
    }
    res = [...res, ...res_dir];
    
    sendJSON(this, res);
  },
  //删除
  delete: function *() {
    const query = this.query;
    const res = yield handleDelete(this, query);
    sendJSON(this, res);
  },
  //新建文件夹
  mkdir: function *() {
    const body = this.request.body;
    body.u_id = 0;
    body.time = new Date();
    const res = yield handleMkdir(this, body);
    sendJSON(this, res);
  },
  //分享
  share: function *() {
    //拿到key
    const body = this.request.body; 
    //拿到记录
    let rows = yield searchFiles(this, body); 
    //移除前缀
    rmProfix(rows); 
    //构造handleShare所需的信息
    const result = {
      u_id: 0,
      addr: randomstring.generate(10),
      secret: (!!+body.isSecret) ? randomstring.generate(6) : null,
      rows
    }
    //添加share表
    const { addr, secret } = yield handleShare(this, result); 
    //响应信息
    const res = {
      addr,
      secret
    }
    //响应
    sendJSON(this, res);
  },
  //取消分享
  unshare: function *() {
    const body = this.request.body;
    body.u_id = 0;
    const res = yield handleUnshare(this, body);
    //{done: true}
    sendJSON(this, res)
  },
  //下载分享
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
    const fileInfo = yield zip(tmp);
    //发送zip
    sendFile(this, fileInfo);
  },
  //转存
  saveShare: function *() {
    const body = this.request.body; //rows
    body.u_id = 0;
    body.time = new Date();
    //插入u_d表
    const res = yield handleSaveShare(this, body);
    //{done: true}
    sendJSON(this, res);

  }
 }