const parse = require('co-busboy');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const mime = require('mime-types');
const Pool = require('./pool');



const cb = (err, result) => { //数据库回调
  if (err){ 
    if (err.constraint !== "documents_pkey") //上传重复的文件
    throw err;
  } 
  else 
    console.log(result.rows);
}

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

module.exports = {
  upLoad: function *(ctx) {
    const { fields, files } = yield handleUpload(ctx);
    if (!Array.isArray(files.files)) //上传单个文件时，不是数组。<input name='files' />
      files.files = [files.files];
    files.files.forEach(file => { //更新数据库
      const d_hash = file.hash;
      const d_dir = path.join(__dirname, `../public/assets/${d_hash}`);
      const d_size = file.size;
      const docValues = [d_hash, d_dir, d_size];
      fs.rename(file.path, d_dir, err => { if (err) throw err; }); //重命名
      ctx.dbquery("insert into documents (d_hash, d_dir, d_size) values ($1, $2, $3);",
        docValues,
        cb);
      //insert u_d
      const u_id = 0;
      const u_dPath = fields.path;
      const name = file.name; //重名处理
      const time = new Date();
      u_dValues = [u_id, d_hash, u_dPath, name, time, time, false];
      ctx.dbquery(`insert into u_d (u_id, d_hash, path, name, createtime, lasttime, isdir) values ($1, $2, $3, $4, $5, $6, $7);`,
        u_dValues,
        cb);
    });
  },

  download: function *(ctx) {
    key = [ctx.params.key];
    const {d_dir, name} = yield handleDownload(ctx, key);
    //发送
    ctx.set('Content-disposition', 'attachment; filename=' + name);
    ctx.set('Content-type', mime.lookup(d_dir));
    ctx.body = fs.createReadStream(d_dir);

  }
 }

const handleDownload = (ctx, key) => new Promise((resolve, reject) => {
  ctx.dbquery(`select d_dir, name from documents inner join u_d on documents.d_hash = u_d.d_hash where u_d.key = $1`,
    key,
    (err, result) => {
      if (err) reject(err);
      resolve(result.rows[0]);
    });
})
