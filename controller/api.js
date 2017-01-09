const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const mime = require('mime-types');
const randomstring = require('randomstring');
const handle = require('./handle.js')();



require('events').EventEmitter.prototype._maxListeners = 100; //设置最大为100，或置0取消


module.exports = {
  //主页
  homeInfo: function *() {
    const query = {u_id: 0};
    const rows = yield handle.handleHomeInfo(this, query);
    handle.sendRes(this, rows);
  },
  //分享页
  shareInfo: function *() {
    const query = this.query;
    const rows = yield handle.handleShareInfo(this, query);
    handle.sendRes(this, rows);
  },
  //上传文件
  upload: function *() {
    const { fields, files } = yield handle.parseFiles(this);

    if (files.files.length === 0) { //无文件上传
      const err = {
        message: '至少上传一个文件!'
      }
      handle.sendRes(this, err);
      return;
    }
    const exist = yield handle.pathIsExist(this, fields.path);
    if (!exist) { //目录错误
      const err = {
        message: '上传目录错误或不存在!'
      }
      handle.sendRes(this, err);
      return;
    }

    //更新数据库，响应体
    const res = yield handle.handleUpload(this, fields, files); 

    //响应
    handle.sendRes(this, res);
  },
  //上传文件夹
  uploadDir: function *() {

    const { fields, files } = yield handle.parseFiles(this);  //解析请求
    console.log(fields, files);
    if (files.files.length === 0) { //无文件上传
      const err = {
        message: '至少上传一个文件!'
      }
      handle.sendRes(this, err);
      return;
    }
    const exist = yield handle.pathIsExist(this, fields.path);
    if (!exist) { //目录错误
      const err = {
        message: '上传目录错误或不存在!'
      }
      handle.sendRes(this, err);
      return;
    }

    //生成文件树
    const body = handle.dirTree(fields, files)
    //处理文件夹
    yield handle.handleUploadDir(this, body);
    console.log(body);
    handle.sendRes(this, body);
  },
  //下载单文件
  download: function *() {
    const body = this.query;
    const { d_dir, name } = yield handle.handleDownload(this, body);
    //发送
    this.set('Content-disposition', 'attachment; filename=' + name);
    this.set('Content-type', mime.lookup(d_dir));
    this.body = fs.createReadStream(d_dir);

  },
  //多文件下载
  downloadzip: function *() {
    const query = this.query;
    //文件信息
    const files = yield handle.searchFiles(this, query);
    //移除前缀
    handle.rmPrefix(files);
    //改写路径
    handle.rewritePath(files);
    //临时目录
    const tmp = fs.mkdtempSync(path.join(__dirname, '../public/download/'));
    //复制文件
    handle.copyFiles(files, tmp);
    //压缩文件
    const fileInfo = yield handle.zip(tmp);
    //发送文件
    handle.sendFile(this, fileInfo);
  },
  //重命名
  rename: function *() {
    const body = this.request.body;
    body.lasttime = new Date();
    const res = yield handle.handleRename(this, body);
    handle.sendRes(this, res);
    
  },
  //移动
  move: function *() {
    const body = this.request.body;
    let res = yield handle.handleMove(this, body);
    if (body.isdir) {
      body.prePath += body.key + '/';
      body.newPath += body.key + '/';
      body.u_id = 0;
      let res_dir = yield handle.handleMoveDir(this, body);
    }
    res = [...res, ...res_dir];
    
    handle.sendRes(this, res);
  },
  //删除
  delete: function *() {
    const query = this.query;
    const res = yield handle.handleDelete(this, query);
    handle.sendRes(this, res);
  },
  //新建文件夹
  mkdir: function *() {
    const body = this.request.body;
    body.u_id = 0;
    body.time = new Date();
    const res = yield handle.handleMkdir(this, body);
    handle.sendRes(this, res);
  },
  //分享
  share: function *() {
    //拿到key
    const body = this.request.body; 
    //拿到记录
    let rows = yield handle.searchFiles(this, body); 
    //移除前缀
    handle.rmPrefix(rows); 
    //构造handleShare所需的信息
    const result = {
      u_id: 0,
      addr: randomstring.generate(10),
      secret: (!!+body.isSecret) ? randomstring.generate(6) : null,
      rows
    }
    //添加share表
    const { addr, secret } = yield handle.handleShare(this, result); 
    //响应信息
    const res = {
      addr,
      secret
    }
    //响应
    handle.sendRes(this, res);
  },
  //取消分享
  unshare: function *() {
    const body = this.request.body;
    body.u_id = 0;
    const res = yield handle.handleUnshare(this, body);
    //{done: true}
    handle.sendRes(this, res)
  },
  //下载分享
  downShare: function *() {
    //获取query
    const query = this.query;
    //查询文件信息
    const files = yield handle.handleDownshare(this, query);
    //创建临时目录
    const tmp = fs.mkdtempSync(path.join(__dirname, '../public/download/'));
    //改写文件目录
    handle.rewritePath(files);
    //复制文件到临时目录
    handle.copyFiles(files, tmp);
    //压缩
    const fileInfo = yield handle.zip(tmp);
    //发送zip
    handle.sendFile(this, fileInfo);
  },
  //转存
  saveShare: function *() {
    const body = this.request.body; //rows
    body.u_id = 0;
    body.time = new Date();
    //插入u_d表
    const res = yield handle.handleSaveShare(this, body);
    //{done: true}
    handle.sendRes(this, res);

  }
 }