const formidable = require('formidable');
const parse = require('co-body');
const path = require('path');
const fs = require('fs');
const mime = require('mime-types');
const randomstring = require('randomstring');
const handle = require('./handle.js')();



require('events').EventEmitter.prototype._maxListeners = 100; //设置最大为100，或置0取消


module.exports = {
  parser: function *(next) {
    try{
      yield next;
    } catch (error) {
      this.status = 500;
      const err = {
        message: error.message
      }
      handle.sendRes(this, err);
    }
  },
  //主页
  homeInfo: function *() {
    const { key } = this.query;
    const u_id = this.req.user.u_id;
    let res;
    if (key) {
      res = yield handle.handleEntityInfo(this, key, u_id);
      if(!res)
        throw Error('key不存在!');
    } else {
      res = yield handle.handleHomeInfo(this, u_id);
    }
    handle.sendRes(this, res);

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

    if (!files.length) //无文件上传
      throw Error('至少上传一个文件!');

    const exist = yield handle.pathIsExist(this, fields.path, this.req.user.u_id);
    if (!exist)  //目录错误
      throw Error('上传目录错误或不存在!')
 

    //更新数据库，响应体
    const res = yield handle.handleUpload(this, fields, files); 

    //响应
    handle.sendRes(this, res);
  },
  //上传文件夹
  uploadDir: function *() {

    const { fields, files } = yield handle.parseFiles(this);  //解析请求
    if (!files.length) //无文件上传
      throw Error('至少上传一个文件!');

    const exist = yield handle.pathIsExist(this, fields.path, this.req.user.u_id);
    if (!exist)  //目录错误
      throw Error('上传目录错误或不存在!')

    //生成文件树
    const body = handle.dirTree(fields, files, this.req.user.u_id)
    //更新数据库
    yield handle.handleUploadDir(this, body);
    handle.sendRes(this, body);
  },

  //下载文件
  download: function *() {
    //keys: array
    let keys = this.query.key;
    //只有一个key时不是数组
    if (!Array.isArray(keys))
      keys = [keys];
    const body = {
      keys,
      u_id: this.req.user.u_id
    }

    const file = yield handle.getAllFiles(this, body);
    if (file.length === 1 && !file.isdir) { //单文件
      const { d_dir, name } = yield handle.handleDownload(this, file[0]);
      //发送
      this.set('Content-disposition', 'attachment; filename=' + name);
      this.set('Content-type', mime.lookup(name));
      this.body = fs.createReadStream(d_dir);
    } else if (!file.length) { //文件不存在
      
        throw Error('目标文件不存在!');

    } else { //多文件或文件夹
      //文件下载所需信息
      files = yield handle.searchFiles(this, file);
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
    }
  },
  //重命名
  rename: function *() {
    const body = this.request.body;
    body.u_id = this.req.user.u_id;
    body.lasttime = new Date();
    const res = yield handle.handleRename(this, body);
    if(!res)  //返回为undefined，key错误或不存在
      throw Error('非法操作!');
      
    handle.sendRes(this, res);
    
  },
  //移动
  move: function *() {
    const body = this.request.body;
    body.u_id = this.req.user.u_id;
    body.lasttime = new Date();

    const exist = yield handle.pathIsExist(this, body.newPath, body.u_id);
    if (!exist)  //目录错误
      throw Error('移动目录错误或不存在!');

    let res = yield handle.handleMove(this, body); 
    if(!res)  //返回为undefined，key错误或不存在
      throw Error('非法操作!');

    //更改文件夹内文件的路径
    for (let file of body.files) {
      file.u_id = this.req.user.u_id;
      if (file.isdir) {
        file.prePath = body.prePath + file.key + '/';
        file.newPath = body.newPath + file.key +　'/';
        let dirInfo = yield handle.handleMoveDir(this, file);
        res = [...res, ...dirInfo];
      }
    }

    handle.sendRes(this, res);
    
  },
  //删除
  delete: function *() {
    const { keys } = this.request.body;
    const u_id = this.req.user.u_id;

    if(!Array.isArray(keys))  //未指定keys，或keys类型错误
      throw Error('必须指定要删除的文件!');

    for (let key of keys)
      yield handle.handleDelete(this, key, u_id);

    handle.sendRes(this, {done: true});
  },
  //新建文件夹
  mkdir: function *() {
    const body = this.request.body;
    body.u_id = this.req.user.u_id;  
    body.time = new Date();

    const exist = yield handle.pathIsExist(this, body.path, body.u_id);
    if (!exist)  //目录错误
      throw Error('目录错误或不存在!');

    //新建文件夹
    const res = yield handle.handleMkdir(this, body);
    handle.sendRes(this, res);
  },
  //分享
  addShare: function *() {
    //拿到key
    const body = this.request.body;
    body.u_id = this.req.user.u_id;
    //拿到所有文件
    let files = yield handle.getAllFiles(this, body);
    if (!files.length)
      throw Error('目标文件不存在!');
      
    //获取记录
    let rows = yield handle.searchFiles(this, files); 
    //移除前缀
    handle.rmPrefix(rows); 
    //构造handleShare所需的信息
    const shareInfo = {
      u_id: this.req.user.u_id,
      addr: randomstring.generate(10),
      secret: (!!+body.isSecret) ? randomstring.generate(6) : null,
      rows
    }
    //添加share表
    const { addr, secret } = yield handle.handleShare(this, shareInfo); 
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
    body.u_id = this.req.user.u_id;
    const res = yield handle.handleUnshare(this, body);
    //{done: true}
    handle.sendRes(this, res)
  },
  //下载分享
  downShare: function *() {
    //获取query
    const query = this.query;
    //查询文件信息
    query.keys = yield handle.getAllDownshareKeys(this, query);
    const files = yield handle.handleDownshare(this, query);
    //请求的分享页地址错误或不存在
    if (!files.length)
      throw Error('分享文件不存在!');
    //创建临时目录
    const tmp = fs.mkdtempSync(path.join(__dirname, '../public/download/'));
    //移除前缀
    handle.rmPrefix(files);
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
    const body = this.request.body; 
    const time = new Date();
    //获取文件信息
    const rows = yield handle.getShare(this, body);
    handle.rmPrefix(rows); //隐含排序

    const map = {};
    for (let row of rows) { 
      map[row.key] = row;
      let keys = row.path.match(/\d+/g);
      row.sharePath = keys ? keys.map(key => map[key]) : '';
      //插入u_d表
      row.u_id = this.req.user.u_id;
      row.time = time;
      row.insertPath = body.path;
      row.key = yield handle.handleSaveShare(this, row);
    }
    //{done: true}
    handle.sendRes(this, {done: true});

  }
 }


