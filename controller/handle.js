const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const mime = require('mime-types');
const randomstring = require('randomstring');
const archiver = require('archiver');

module.exports = function handle() {
  /** send zip
   * @param {Object} ctx 
   * @param {Object} fileInfo
   * @param {string} fileInfo.filePath
   * @param {string} fileInfo.fileName
   */
  const sendFile = (ctx, fileInfo) => {
    const {filePath, fileName} = fileInfo;
    ctx.set('Content-disposition', 'attachment; filename=' + fileName);
    ctx.set('Content-type', mime.lookup(filePath));
    ctx.body = fs.createReadStream(filePath);
    ctx.body.on('close', () => fs.unlinkSync(filePath));

  }
  /**send response in json 
   * @param {Object} ctx
   * @param {Object} res - response body
   */
  const sendRes = (ctx, res) => {
    ctx.set('Content-type', 'application/json');
    ctx.body = JSON.stringify(res);
  }

  /**Compresses the specified folder 
   * @param {string} tmp - the path of folder path
   * @returns {Promise}
   */
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

  /**delete specified directory
   * @param {string} dir - directory path
   */
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


  /**parse upload files  (mutipart/form-data)
   * @param {Object} ctx
   * @returns {Promise} 
   */
  const parseFiles = ctx => new Promise((resolve, reject) => { //处理文件上传
    const uploadDir = path.join(__dirname, `../public/assets`);
    let form = formidable.IncomingForm({
      uploadDir,
      keepExtensions: false,
      hash: 'sha1',
      multiples: true
    });

    form.parse(ctx.req, (err, fields, files) => {
      if (err) reject(err);
      files = files.files; //files 为前端<input>的name属性

      if (!files) //上传文件为空
        files = [];
      if (!Array.isArray(files)) //上传单个文件时，不是数组。<input name='files' />
        files = [files];

      for(let file of files) 
        fs.rename(file.path, path.join(__dirname, `../public/assets/${file.hash}`), err => { if (err) throw err; }); //用hash值来重命名
      resolve({ fields, files });
    });
  });

  /**insert into table documents
   * @param {Object} ctx
   * @param {Object} body
   * @param {string} body.d_hash - hash of file
   * @param {string} body.d_dir - absolute path of file
   * @param {number} body.d_size - size of file
   * @returns {Promise}
   */
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

  /**insert into table u_d
   * @param {Object} ctx
   * @param {Object} body
   * @returns {Promise}
   */
  const insertU_D = (ctx, body) => new Promise((resolve, reject) => {
    const { u_id, d_hash, path, name, time } = body;
    const values = [u_id, d_hash, path, name, time, time, false];
    ctx.dbquery(`insert into u_d (u_id, d_hash, path, name, createtime, lasttime, isdir) values ($1, $2, $3, $4, $5, $6, $7) returning key, d_hash, name, path, isdir, createtime, lasttime;`,
      values,
      (err, result) => {
        if (err) reject(err);
        resolve(result.rows[0]);
      });
  })

  /**handle req to rename files
   * @param {Object} ctx
   * @param {Object} body
   * @returns {Promise}
   */
  const handleRename = (ctx, body) => new Promise((resolve, reject) => { //rename 
    const { name, lasttime, key, u_id } = body;
    const values = [name, lasttime, key, u_id];
    ctx.dbquery(`update u_d set name = $1, lasttime = $2 where key = $3 and u_id = $4 returning key, name;`,
      values,
      (err, result) => {
        if (err) reject(err);
        resolve(result.rows[0]);
      });
  })

  /**handle req to move files
   * @param {Object} ctx
   * @param {Object} body
   * @returns {Promise}
   */
  const handleMove = (ctx, body) => new Promise((resolve, reject) => { //move 
    const { newPath, files, lasttime, u_id } = body;
    const keys = files.map(file => file.key);
    const values = [lasttime, newPath, u_id];
    ctx.dbquery(`update u_d set lasttime = $1, path = $2 where key in (${keys.toString()}) and u_id = $3 returning key, path, lasttime;`,
      values,
      (err, result) => {
        if (err) reject(err);
        resolve(result.rows);
      });
  })

  /**handle req to move folder
   * @param {Object} ctx
   * @param {Object} body
   * @returns {Promise}
   */
  const handleMoveDir = (ctx, body) => new Promise((resolve, reject) => { //move 
    const { prePath, newPath, u_id } = body;
    const pathLike = '%' + prePath + '%';
    const values = [prePath, newPath, u_id, pathLike];
    ctx.dbquery(`update u_d set path = replace(path, $1, $2) where u_id = $3 and path like $4 returning key, path, lasttime;`,
      values,
      (err, result) => {
        if (err) reject(err);
        resolve(result.rows);
      });
  })

/** get all the files info by specified keys and u_id
 * @param {Object} ctx
 * @param {Object} body
 * @param {Array} body.keys
 * @param {number} body.u_id
 * @return {Promise}
 */
  const getAllFiles = (ctx, body) => new Promise((resolve, reject) => { 
    const { keys, u_id } = body;
    const pathReg = '%(' + keys.join('|') + ')%'; //获得子文件的key
    const values = [u_id];
    ctx.dbquery(`select key, isdir, u_id from u_d where (key in (${keys.toString()}) or path similar to '${pathReg}' ) and  u_id = $1;`,
      values,
      (err, result) => {
        if (err) reject(err);
        resolve(result.rows);
      });
  });

  /**handle req to download files
   * @param {Object} ctx
   * @param {Object} body
   * @param {number} body.key
   * @param {number} body.u_id
   * @returns {Promise}
   */
  const handleDownload = (ctx, body) => new Promise((resolve, reject) => { //download 
    const { key, u_id } = body;
    const values = [key, u_id];
    ctx.dbquery(`select d_dir, name from documents inner join u_d on documents.d_hash = u_d.d_hash where u_d.key = $1 and  u_d.u_id = $2;`,
      values,
      (err, result) => {
        if (err) reject(err);
        resolve(result.rows[0]);
      });
  });

  /**handle req to delete files 
   * @param {Object} ctx
   * @param {Object} body
   * @param {number} body.key
   * @param {number} body.u_id
   * @returns {Promise}
   */
  const handleDelete = (ctx, key, u_id) => new Promise((resolve, reject) => { //download 

    const pathLike = `%${key}%`; //内部的文件
    const values = [key, pathLike, u_id]
    ctx.dbquery(`delete from u_d where (key = $1 or path like $2) and u_id = $3 `,
      values,
      (err, result) => {
        if (err) reject(err);
        resolve({done: true});
      });
  });

  /**handle req to create a folder
   * @param {Object} ctx
   * @param {Object} body
   * @returns {Promise}
   */
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

  /**search files info for download 
 * @param {Object} ctx
 * @param {Array} body
 * @param {number} body[].key
 * @param {number} body[].u_id
 * @return {Promise}
 */
  const searchFiles = (ctx, body) => new Promise((resolve, reject) => { //downloadzip 
    let keys = body.map(file => file.key);
    const u_id = body[0].u_id;
    keys = '(' + keys.join(',') + ')';
    ctx.dbquery(`select key, u_d.d_hash, d_dir, isdir, path, name from u_d left join documents on documents.d_hash = u_d.d_hash where u_d.key in ${keys} and u_d.u_id = $1 ;`,
      [u_id],
      (err, result) => {
        if (err) reject(err);
        resolve(result.rows);
      });
  });


  /** handle to uplaod folder
   * @param {Object} ctx
   * @param {Object} level - returned by dirTree function
   */
  function* handleUploadDir(ctx, level) {
    while (level.length) { //为空即全部完成。
      let nextLevel = []; //下一层

      for (let body of level) {
        body.path = body.path(); //获取path
        //更新数据库
        if (body.children) {   //是目录
          body.key = (yield handleMkdir(ctx, body)).key;
          body.isdir = true;
          nextLevel = [...nextLevel, ...body.children]; //下一层的文件/目录
        } else {  //不是目录
          yield insertDoc(ctx, body);
          body.isdir = false;
          body.key = (yield insertU_D(ctx, body)).key;
        }
        //去除多余的属性
        delete body.d_hash;
        delete body.d_dir;
        delete body.u_id;
        body.createtime = body.time;
        body.lasttime = body.time;
        delete body.time;

      }

      level = nextLevel; //更新level
    }

  }

 /** handle req to add share
  * @param {Object} ctx 
  * @param {Object} body
  * @returns {Promise}
  */
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

   /** handle req to unshare
  * @param {Object} ctx 
  * @param {Object} body
  * @param {number} body.u_id
  * @param {string} body.addr
  * @returns {Promise}
  */
  const handleUnshare = (ctx, body) => new Promise((resolve, reject) => { 
    const { addr, u_id } = body;
    const values = [addr, u_id];
    ctx.dbquery(`delete from share where addr = $1 and u_id = $2 ;`,
      values,
      (err, result) => {
        if (err) reject(err);
        resolve({ done: true });
      });
  });


 /**Sort by file hierarchy and remove common prefixes
  * @param {Array} files
  * @param {string} files[].path
  */
  const rmPrefix = files => {
    files.sort((a, b) => a.path.match(/\//g).length > b.path.match(/\//g).length); //排序
    const prefix = files[0].path; //前缀
    for (let file of files)
      file.path = file.path.replace(prefix, '/');
  };


  /**rewrite the path to truth path
   * @param {Array} files
   * @param {number} files[].key
   * @param {string} files[].name
   * @param {string} files[].path
   */
  const rewritePath = files => {
    const dirMap = {};
    for (let file of files) {
      dirMap[file.key] = file.name;
      let temp = file.path.split('/');
      temp = temp.map(key => key && dirMap[+key]);
      file.path = temp.join('/') + file.name;
    }
  }

  /**Copy files to the specified directory
   * @param {Array} files
   * @param {string} dir - the path of directory
   * @param {string} files[].path
   * @param {boolean} files[].isdir
   * @param {string} files[].d_dir
   */
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

  /**handle req to download shared files
   * @param {Object} ctx
   * @param {Object} body
   * @param {string} body.addr
   * @returns {Promise} 
   */
  const handleDownshare = (ctx, body) => new Promise((resolve, reject) => { 
    const { addr } = body;
    const values = [addr];
    ctx.dbquery(`select key, name, path, isdir, d_dir from share where addr = $1 ;`,
      values,
      (err, result) => {
        if (err) reject(err);
        resolve(result.rows);
      });
  });



  /**generate the files tree
   * @param {Object} fields
   * @param {Array} files
   * @param {number} u_id
   * @returns {Array}
   */
  function dirTree(fields, files, u_id) {
    const root = {
      path: fields.path,
      name: '',
      children: []
    };

    const time = new Date(Date.now() + (8 * 60 * 60 * 1000));    //统一上传时间

    //产生dirtree
    for (let file of files) {
      let dirPath = file.name.split(/\/|\?/); //用?分隔是测试时用的
      //记录文件信息
      const body = {  //insertDoc(): 必需d_hash, d_dir, d_size, 
        d_hash: file.hash,
        d_dir: path.join(__dirname, `../public/assets/${file.hash}`),
        d_size: file.size,
        u_id,         //insertU_D(): 必需u_id, d_hash, name, time, path (缺path)
        name: dirPath.pop(),
        time,
      }

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

  /** handle req to gain the home page info 
  * @param {Object} ctx 
  * @param {number} u_id
  * @returns {Promise}
  */
  const handleHomeInfo = (ctx, u_id) => new Promise((resolve, reject) => {
    ctx.dbquery(`select key, name, path, isdir, createtime, lasttime, d_size from u_d left join documents on u_d.d_hash = documents.d_hash where u_id = $1 ;`,
      [u_id],
      (err, result) => {
        if (err) reject(err);
        resolve(result.rows);
      });
  });
  /** handle req to gain entry info specified by key 
  * @param {Object} ctx 
  * @param {number} key
  * @param {number} u_id
  * @returns {Promise}
  */
  const handleEntryInfo = (ctx, key, u_id) => new Promise((resolve, reject) => {
    const values = [u_id, key];
    ctx.dbquery(`select key, name, path, isdir, createtime, lasttime, d_size from u_d left join documents on u_d.d_hash = documents.d_hash where u_id = $1 and key  = $2;`,
      values,
      (err, result) => {
        if (err) reject(err);
        resolve(result.rows[0]);
      });
  });

  /** handle req to gain the share page info 
  * @param {Object} ctx 
  * @param {Object} body
  * @param {string} body.addr
  * @returns {Promise}
  */ 
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

/** handle req to save shared files
 * @param {Object} ctx
 * @param {Object} body
 * @returns {Promise}
 */
  const handleSaveShare = (ctx, body) => new Promise((resolve, reject) => {
    const { name, insertPath, sharePath, isdir, d_hash, u_id, time } = body;
    let newPath = sharePath ? sharePath.map( f => f.key ).join('/') + '/' : '';
    newPath = insertPath + newPath ;
    const values = [name, newPath, isdir, d_hash, u_id, time, time];
    ctx.dbquery(`insert into u_d (name, path, isdir, d_hash, u_id, createtime, lasttime) values ($1, $2, $3, $4, $5, $6, $7) returning key ;`,
      values,
      (err, result) => {
        if (err) reject(err);
        resolve(result.rows[0].key);
      });
  });

/** handle req to upload files
 * @param {Object} ctx
 * @param {Object} fields
 * @param {Array} files
 */
  function* handleUpload(ctx, fields, files) {
    let res = [];
    const time = new Date(Date.now() + (8 * 60 * 60 * 1000));    //统一上传时间。
    for (let file of files) { //处理每个文件
      const body = {
        d_hash: file.hash,
        d_dir: path.join(__dirname, `../public/assets/${file.hash}`),
        d_size: file.size,
        u_id: ctx.req.user.u_id,
        path: fields.path,
        name: file.name,
        time
      }

      yield insertDoc(ctx, body); //插入documents表
      const { key } = yield insertU_D(ctx, body); //插入u_d表

      const row = { //响应信息
        key,
        name: body.name,
        path: body.path,
        createtime: time,
        lasttime: time,
        isdir: false,
        d_size: body.d_size
      }
     res = [...res, row];
    }
    return res;
  };

  /** Determine whether the path exists
  * @param {Object} ctx
  * @param {string} filePath
  * @param {number} u_id
  * @returns {Promise}
  */
  const pathIsExist = (ctx, filePath, u_id) => new Promise((resolve, reject) => {
    if (!filePath) //path不存在
      resolve(false);
    else if (filePath === '/') //path为根目录
      resolve(true);
    else {
      filePath = filePath.match(/\d+/g);
      const key = filePath.pop();
      filePath = '/' + filePath.length ? (filePath.join('/') + '/') : '';
      values = [key, true, u_id];
      ctx.dbquery(`select path from u_d where key = $1 and isdir = $2 and u_id = $3;`,
        values,
        (err, result) => {
          if (err) reject(err);

          if (result.rows.length === 0) //key不存在或不是文件夹
            resolve(false);
          else if (result.rows[0].path === filePath) //正确
            resolve(true);
          else
            resolve(false); //path不对
        });
    }

  });

/** gain info of files which specified by keys and addr
 * @param {Object} ctx
 * @param {Object} body
 * @param {string} body.addr - share page address
 * @param {Array} body.keys - files key
 * @returns {Promise}
 */
const getShare = (ctx, body) => new Promise((resolve, reject) => {
  const { addr, keys } = body;
  const pathReg = '%(' + keys.join('|') + ')%';
  ctx.dbquery(`select key, d_hash, path, name, isdir from share where (key in (${keys.toString()}) or path similar to '${pathReg}' ) and  addr = $1;`,
    [addr],
    (err, result) => {
      if (err) reject(err);
      resolve(result.rows);
    });
 });


return {
  handleEntryInfo,
  handleSaveShare,
  handleHomeInfo,
  handleShareInfo,
  parseFiles,
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
  sendRes,
  zip,
  delDir,
  dirTree,
  rmPrefix,
  rewritePath,
  copyFiles,
  pathIsExist,
  getAllFiles,
  getShare
}




}