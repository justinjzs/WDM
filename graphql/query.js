const query = require('../controller/db').query(); //拿到数据库查询函数



/**
 * @param {String|Number} key
 * @param {String} path path of specified dir
 * @returns {Promise} resolve(Array)
 */
const insideFolder = (key, path) => new Promise((resolve, reject) => {
  const insidePath = path + key + '/';
  query(`select key, name, path, isdir, createtime, lasttime, d_size 
      from u_d left join documents on u_d.d_hash = documents.d_hash 
      where path = $1;`,
    [insidePath],
    (err, result) => {
      if (err) return reject(err);
      resolve(result.rows);
    });
})

/**
 * @param {String|Number} u_id
 * @param {String} path
 * @returns {Promise} resolve(Array)
 */
const entityByPath = ({ u_id }, path) => new Promise((resolve, reject) => {
  query(`select key, name, path, isdir, createtime, lasttime, d_size 
    from u_d left join documents on u_d.d_hash = documents.d_hash 
    where u_id = $1 and path = $2;`,
    [u_id, path],
    (err, result) => {
      if (err) return reject(err);
      resolve(result.rows);
    });
})

/**
 * @param {String|Number} u_id
 * @param {String|Number} key
 * @returns {Promise} resolve(Object)
 */
const entityByKey = ({ u_id }, key) => new Promise((resolve, reject) => {
  query(`select key, name, path, isdir, createtime, lasttime, d_size 
      from u_d left join documents on u_d.d_hash = documents.d_hash 
      where u_id = $1 and key = $2;`,
    [u_id, key],
    (err, result) => {
      if (err) return reject(err);
      if (!result.rows.length)
        return reject('Key is not existing!');
      resolve(result.rows[0]);
    });
})

/**
 * @param {String|Number} u_id
 * @param {String} name
 * @param {String} path  path of specified dir
 * @returns {Promise} resolve(Array)
 */
const entityByName = ({ u_id }, name, path) => new Promise((resolve, reject) => {
  const nameLike = `%${name}%`;
  const pathLike = `%${path}%`;
  query(`select key, name, path, isdir, createtime, lasttime, d_size 
      from u_d left join documents on u_d.d_hash = documents.d_hash 
      where u_id = $1 and name like $2 and path like $3;`,
    [u_id, nameLike, pathLike],
    (err, result) => {
      if (err) return reject(err);
      resolve(result.rows);
    });
})

/**
 * @param {String|Number} u_id
 * @param {String} name
 * @param {String} path  path of specified dir
 * @returns {Promise} resolve(Object)
 */
const mkdir = ({ u_id }, name, path) => new Promise((resolve, reject) => {
  const time = new Date();
  const values = [u_id, name, path, time, time, true];
  query(`insert into u_d (u_id, name, path, createtime, lasttime, isdir) 
      values ($1, $2, $3, $4, $5, $6) 
      returning key, name, path, isdir,createtime, lasttime;`,
    values,
    (err, result) => {
      if (err) return reject(err);
      resolve(result.rows[0]);
    });
})

/**
 * @param {String|Number} u_id
 * @param {String|Number} key
 * @param {String} name
 * @returns {Promise} resolve()
 */
const rename = ({ u_id }, key, name) => new Promise((resolve, reject) => {
  const time = new Date();
  const values = [name, time, key, u_id];
  query(`update u_d set name = $1, lasttime = $2 
    where key = $3 and u_id = $4;`,
    values,
    (err, result) => {
      if (err) return reject(err);
      resolve();
    })
})
/**
 * @param {String|Number} u_id
 * @param {String|Number} key
 * @param {String} path
 * @returns {Promise} resolve(Boolean)
 */
const move = ({ u_id }, key, prePath, newPath) => new Promise((resolve, reject) => {
  const folders = newPath.match(/\d+/g);
  if (folders) {
    for (let dirKey of folders)
      if (+dirKey === key)   //试图把父文件移动到子文件
        return reject('The destination folder is a subfolder of the source folder');
  }
  
  const time = new Date();
  const values = [newPath, time, key, u_id, prePath];
  query(`update u_d set path = $1, lasttime = $2 
    where key = $3 and u_id = $4 and path = $5
    returning isdir;`,
    values,
    (err, result) => {
      if (err) return reject(err);
      if (!result.rows.length)
        return reject('The key does not match the path')
      resolve(result.rows[0].isdir);
    });
})

/**
 * @param {String|Number} u_id
 * @param {String|Number} key
 * @param {String} prePath
 * @param {String} newPath
 * @returns {Promise} resolve()
 */
const moveDir = ({ u_id }, key, prePath, newPath) => new Promise((resolve, reject) => {
  prePath = prePath + key + '/';
  newPath = newPath + key + '/';
  const pathLike = `%${key}%`;
  const values = [prePath, newPath, u_id, pathLike];
  query(`update u_d set path = replace(path, $1, $2) 
    where u_id = $3 and path like $4;`,
    values,
    (err, result) => {
      if (err) return reject(err);
      resolve();
    });
})

/**
 * @param {String|Number} u_id
 * @param {String|Number} key
 * @returns {Promise} resolve()
 */
const delEntity = ({ u_id }, key) => new Promise((resolve, reject) => {
  const values = [key, `%${key}%`, u_id];
  query(`delete from u_d where (key = $1 or path like $2) and u_id = $3 `,
    values,
    (err, result) => {
      if (err) return reject(err);
      resolve();
    });
})

/**
 * @param {String|Number} u_id
 * @param {String} path  path of specified dir
 * @returns {Promise} 
 */
const pathIsExist = ({ u_id }, path) => new Promise((resolve, reject) => {
  if (path === '/') //path为根目录
    return resolve();
  else {
    path = path.match(/\d+/g);
    const key = path.pop();
    path = '/' + (path.length ? (path.join('/') + '/') : '');

    const values = [key, true, u_id, path];
    query(`select path from u_d 
        where key = $1 and isdir = $2 
        and u_id = $3 and path = $4;`,
      values,
      (err, result) => {
        if (err) return reject(err); //数据库查询错误

        if (!result.rows.length) //key不存在或不是文件夹
          return reject('Path is not existing!');
        else
          resolve();
      });
  }

})

/**
 * @param {String|Number} u_id
 * @returns {Promise} 
 */
const getAllFolders = ({ u_id }) => new Promise((resolve, reject) => {
  const values = [u_id, true];
  query(`select key, name, path, isdir, createtime, lasttime from u_d
    where u_id = $1 and isdir = $2`,
    values,
    (err, result) => {
      if (err) return reject(err);
      resolve(result.rows)
    })
})
/**
 * @param {String|Number} u_id
 * @returns {Promise} 
 */
const getAllShareRecords = ({ u_id }) => new Promise((resolve, reject) => {
  const values = [u_id];
  query(`select distinct on(addr) key, name, addr, secret, isdir from share
    where u_id = $1`,
    values,
    (err, result) => {
      if (err) return reject(err);
      resolve(result.rows)
    })
})

module.exports = {
  entityByKey,
  entityByName,
  entityByPath,
  insideFolder,
  mkdir,
  rename,
  move,
  moveDir,
  delEntity,
  pathIsExist,
  getAllFolders,
  getAllShareRecords
}





